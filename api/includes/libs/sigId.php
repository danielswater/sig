<?php 
/**
 * Allows defining and checking user authentication via ACLs, authorization levels or a simple logged in/not logged in scheme
 *
 * @copyright  Copyright (c) 2007-2011 Will Bond
 * @author     Will Bond [wb] <will@flourishlib.com>
 * @license    http://flourishlib.com/license
 *
 * @package    Flourish
 * @link       http://flourishlib.com/sigId
 *
 * @version    1.0.0b6
 * @changes    1.0.0b6  Fixed ::checkIP() to not trigger a notice when `$_SERVER['REMOTE_ADDR']` is not set [wb, 2011-05-10]
 * @changes    1.0.0b5  Added ::getLoginPage() [wb, 2010-03-09]
 * @changes    1.0.0b4  Updated class to use new fSession API [wb, 2009-10-23]
 * @changes    1.0.0b3  Updated class to use new fSession API [wb, 2009-05-08]
 * @changes    1.0.0b2  Fixed a bug with using named IP ranges in ::checkIP() [wb, 2009-01-10]
 * @changes    1.0.0b   The initial implementation [wb, 2007-06-14]
 */

define('DEF_EXPIRATION', 43200);

class sigId
{
	// The following constants allow for nice looking callbacks to static methods
	const configure		   = 'sigId::configure';
	const checkACL         = 'sigId::checkACL';
	const checkAuthLevel   = 'sigId::checkAuthLevel';
	const checkIP          = 'sigId::checkIP';
	const checkLoggedIn    = 'sigId::checkLoggedIn';
	const destroyUserInfo  = 'sigId::destroyUserInfo';
	const getLoginPage     = 'sigId::getLoginPage';
	const getRequestedURL  = 'sigId::getRequestedURL';
	const getUserACLs      = 'sigId::getUserACLs';
	const getUserAuthLevels = 'sigId::getUserAuthLevels';
	const getUserToken     = 'sigId::getUserToken';
	const getUserAuthToken = 'sigId::getUserAuthToken';
	const requireACL       = 'sigId::requireACL';
	const requireAuthLevel = 'sigId::requireAuthLevel';
	const requireLoggedIn  = 'sigId::requireLoggedIn';
	const reset            = 'sigId::reset';
	const setAuthLevels    = 'sigId::setAuthLevels';
	const setLoginPage     = 'sigId::setLoginPage';
	const setRequestedURL  = 'sigId::setRequestedURL';
	const setUserACLs      = 'sigId::setUserACLs';
	const setUserAuthLevels = 'sigId::setUserAuthLevels';
	const setUserToken     = 'sigId::setUserToken';
	const setUserAuthToken = 'sigId::setUserAuthToken';
	const hashPassword	   = 'sigId::hashPassword';
	const checkPassword	   = 'sigId::checkPassword';


	static private $cache = NULL;
	static private $cookie_domain = NULL;
	static private $cookie_name = NULL;
	static private $cookie_expires = NULL;
	static private $cookie_token = NULL;

	static public function hashPassword($pass)
	{
		$hasher = new PasswordHash(8,true);
		return $hasher->HashPassword($pass);
	}

	static public function checkPassword($pass, $hash)
	{
		$hasher = new PasswordHash(8,true);		
		return $hasher->CheckPassword($pass, $hash);
	}

	static public function configure($config)
	{
		//Main entry point, initialize cache
		self::$cache = new Memcache;
		$memcache_pool_servers = explode(";", $config['cache_server']);
		foreach ($memcache_pool_servers as $oneserver) {
			self::$cache->addServer($oneserver, $config['cache_port']);
		}

		self::$cookie_domain = $config['cookie_domain'];
		self::$cookie_name = $config['cookie_name'];
		self::$cookie_expires = $config['cookie_expires'];

		//Check if we have a valid login cookie, and retrieve its token
		if (array_key_exists(self::$cookie_name,$_COOKIE)){
			self::$cookie_token = $_COOKIE[self::$cookie_name];
			//TODO: maybe check if it is expired/good?
		} else {
			//generate a new cookie_token, will be used when setting values
			self::$cookie_token =  fCryptography::randomString(16, 'alphanumeric');
		}
	}
	
	static public function isLoggedIn()
	{
		self::validateLoginPage();

		if (self::checkLoggedIn()) {
			return true;
		}

		return false;
	}

	static public function getUserAuthToken()
	{
		return self::$cookie_token;
	}

	static public function setUserAuthToken($token)
	{
		self::$cookie_token = $token;
	}

	/**
	 * The valid auth levels
	 *
	 * @var array
	 */
	static private $levels = array(
        'sysadmin' => 100,
        'admin' => 90,
        'supervisor' => 75,
        'operator' => 50,
        'superuser' => 40,
        'user'  => 25,
        'guest' => 10
    );

	/**
	 * The login page
	 *
	 * @var string
	 */
	static private $login_page = '../../index.html';

	/**
	 * Named IP ranges
	 *
	 * @var array
	 */
	static private $named_ip_ranges = array();


	/**
	 * Adds a named IP address or range, or array of addresses and/or ranges
	 *
	 * This method allows ::checkIP() to be called with a name instead of the
	 * actual IPs.
	 *
	 * @param  string $name       The name to give the IP addresses/ranges
	 * @param  mixed  $ip_ranges  This can be string (or array of strings) of the IPs or IP ranges to restrict to - please see ::checkIP() for format details
	 * @return void
	 */
	static public function addNamedIPRange($name, $ip_ranges)
	{
		self::$named_ip_ranges[$name] = $ip_ranges;
	}


	/**
	 * Checks to see if the logged in user meets the requirements of the ACL specified
	 *
	 * @param  string $resource    The resource we are checking permissions for
	 * @param  string $permission  The permission to require from the user
	 * @return boolean  If the user has the required permissions
	 */
	static public function checkACL($app_code, $resource, $permission)
	{
		if (self::getUserACLs() === FALSE) {
			return FALSE;
		}

		$acls = self::getUserACLs();

		if (is_null($acls)) {
			return FALSE;
		}

		//Decode json array
		$acls = json_decode($acls, true);

		if (!array_key_exists($app_code, $acls)) {
			return FALSE;
		}

		$app_acls = $acls[$app_code];

		if (!isset($app_acls[$resource]) && !isset($app_acls['*'])) {
			return FALSE;
		}

		if (isset($app_acls[$resource])) {
			if (in_array($permission, $app_acls[$resource]) || in_array('*', $app_acls[$resource])) {
				return TRUE;
			}
		}

		if (isset($app_acls['*'])) {
			if (in_array($permission, $app_acls['*']) || in_array('*', $app_acls['*'])) {
				return TRUE;
			}
		}

		return FALSE;
	}


	/**
	 * Checks to see if the logged in user has the specified auth level
	 *
	 * @param  string $level  The level to check against the logged in user's level
	 * @return boolean  If the user has the required auth level
	 */
	static public function checkAuthLevel($app_code, $level)
	{
		$user_authlevels = self::getUserAuthLevels();
		if (!is_null($user_authlevels)) {
			//Decode json authlevels
			$user_authlevels = json_decode($user_authlevels, true);

			//Try to find a key for our app
			if (array_key_exists($app_code, $user_authlevels))
			{
				$user_number = $user_authlevels[$app_code];
				$required_number = self::$levels[$level];

				if ($user_number >= $required_number) {
					return TRUE;
				}
			}
		}

		return FALSE;
	}


	/**
	 * Checks to see if the user is from the IPs or IP ranges specified
	 *
	 * The `$ip_ranges` parameter can be either a single string, or an array of
	 * strings, each of which should be in one of the following formats:
	 *
	 *  - A single IP address:
	 *   - 192.168.1.1
	 *   - 208.77.188.166
	 *  - A CIDR range
	 *   - 192.168.1.0/24
	 *   - 208.77.188.160/28
	 *  - An IP/subnet mask combination
	 *   - 192.168.1.0/255.255.255.0
	 *   - 208.77.188.160/255.255.255.240
	 *
	 * @param  mixed $ip_ranges  A string (or array of strings) of the IPs or IP ranges to restrict to - see method description for details
	 * @return boolean  If the user is coming from (one of) the IPs or ranges specified
	 */
	static public function checkIP($ip_ranges)
	{
		// Check to see if a named IP range was specified
		if (is_string($ip_ranges) && isset(self::$named_ip_ranges[$ip_ranges])) {
			$ip_ranges = self::$named_ip_ranges[$ip_ranges];
		}

		if (!isset($_SERVER['REMOTE_ADDR'])) {
			return FALSE;
		}

		// Get the remote IP and remove any IPv6 to IPv4 mapping
		$user_ip      = str_replace('::ffff:', '', $_SERVER['REMOTE_ADDR']);
		$user_ip_long = ip2long($user_ip);

		settype($ip_ranges, 'array');

		foreach ($ip_ranges as $ip_range) {

			if (strpos($ip_range, '/') === FALSE) {
				$ip_range .= '/32';
			}

			list($range_ip, $range_mask) = explode('/', $ip_range);

			if (strlen($range_mask) < 3) {
				$mask_long = pow(2, 32) - pow(2, 32 - $range_mask);
			} else {
				$mask_long = ip2long($range_mask);
			}

			$range_ip_long = ip2long($range_ip);

			if (($range_ip_long & $mask_long) != $range_ip_long) {
				$proper_range_ip = long2ip($range_ip_long & $mask_long);
				throw new fProgrammerException(
					'The range base IP address specified, %1$s, is invalid for the CIDR range or subnet mask provided (%2$s). The proper IP is %3$s.',
					$range_ip,
					'/' . $range_mask,
					$proper_range_ip
				);
			}

			if (($user_ip_long & $mask_long) == $range_ip_long) {
				return TRUE;
			}
		}

		return FALSE;
	}


	/**
	 * Checks to see if the user has an auth level or ACLs defined
	 *
	 * @return boolean  If the user is logged in
	 */
	static public function checkLoggedIn()
	{
		if (fSession::get(__CLASS__ . '::user_auth_level', NULL) !== NULL ||
			fSession::get(__CLASS__ . '::user_acls', NULL) !== NULL ||
			fSession::get(__CLASS__ . '::user_token', NULL) !== NULL) {
			return TRUE;
		}
		return FALSE;
	}


	/**
	 * Destroys the user's auth level and/or ACLs
	 *
	 * @return void
	 */
	static public function destroyUserInfo()
	{
		fSession::delete(__CLASS__ . '::user_auth_level');
		fSession::delete(__CLASS__ . '::user_acls');
		fSession::delete(__CLASS__ . '::user_token');
		fSession::delete(__CLASS__ . '::requested_url');
	}


	/**
	 * Returns the login page set via ::setLoginPage()
	 *
	 * @return string  The login page users are redirected to if they don't have the required authorization
	 */
	static public function getLoginPage()
	{
		return self::$login_page;
	}

	/**
	 * Returns the URL requested before the user was redirected to the login page
	 *
	 * @param  boolean $clear        If the requested url should be cleared from the session after it is retrieved
	 * @param  string  $default_url  The default URL to return if the user was not redirected
	 * @return string  The URL that was requested before they were redirected to the login page
	 */
	static public function getRequestedURL($clear, $default_url=NULL)
	{
		$requested_url = fSession::get(__CLASS__ . '::requested_url', $default_url);
		if ($clear) {
			fSession::delete(__CLASS__ . '::requested_url');
		}
		return $requested_url;
	}


	/**
	 * Gets the ACLs for the logged in user
	 *
	 * @return array  The logged in user's ACLs
	 */
	static public function getUserACLs()
	{
		return fSession::get(__CLASS__ . '::user_acls', NULL);
	}
	

	/**
	 * Gets the authorization level for the logged in user
	 *
	 * @return string  The logged in user's auth level
	 */
	static public function getUserAuthLevel()
	{
		return fSession::get(__CLASS__ . '::user_auth_level', NULL);
	}


	/**
	 * Gets the value that was set as the user token, `NULL` if no token has been set
	 *
	 * @return mixed  The user token that had been set, `NULL` if none
	 */
	static public function getUserToken()
	{
		return fSession::get(__CLASS__ . '::user_token', NULL);
	}


	/**
	 * Redirects the user to the login page
	 *
	 * @return void
	 */
	static private function redirect()
	{
		self::setRequestedURL(fURL::getWithQueryString());
		fURL::redirect(self::$login_page);
	}


	/**
	 * Redirect the user to the login page if they do not have the permissions required
	 *
	 * @param  string $resource    The resource we are checking permissions for
	 * @param  string $permission  The permission to require from the user
	 * @return void
	 */
	static public function requireACL($resource, $permission)
	{
		self::validateLoginPage();
		
		if (self::checkACL($resource, $permission)) {
			return;
		}
		
		self::redirect();
	}


	/**
	 * Redirect the user to the login page if they do not have the auth level required
	 *
	 * @param  string $level  The level to check against the logged in user's level
	 * @return void
	 */
	static public function requireAuthLevel($level)
	{
		self::validateLoginPage();
		
		if (self::checkAuthLevel($level)) {
			return;
		}
		
		self::redirect();
	}


	/**
	 * Redirect the user to the login page if they do not have an auth level or ACLs
	 *
	 * @return void
	 */
	static public function requireLoggedIn()
	{
		self::validateLoginPage();
		
		if (self::checkLoggedIn()) {
			return;
		}
		
		self::redirect();
	}
	
	
	/**
	 * Resets the configuration of the class
	 * 
	 * @internal
	 * 
	 * @return void
	 */
	static public function reset()
	{
		self::$level           = NULL;
		self::$login_page      = NULL;
		self::$named_ip_ranges = array();
	}


	/**
	 * Sets the authorization levels to use for level checking
	 *
	 * @param  array $levels  An associative array of `(string) {level} => (integer) {value}`, for each level
	 * @return void
	 */
	static public function setAuthLevels($levels)
	{
		self::$levels = $levels;
	}


	/**
	 * Sets the login page to redirect users to
	 *
	 * @param  string $url  The URL of the login page
	 * @return void
	 */
	static public function setLoginPage($url)
	{
		self::$login_page = $url;
	}


	/**
	 * Sets the restricted URL requested by the user
	 *
	 * @param  string  $url  The URL to save as the requested URL
	 * @return void
	 */
	static public function setRequestedURL($url)
	{
		fSession::set(__CLASS__ . '::requested_url', $url);
	}


	/**
	 * Sets the ACLs for the logged in user.
	 *
	 * Array should be formatted like:
	 *
	 * {{{
	 * array (
	 *     (string) {resource name} => array(
	 *         (mixed) {permission}, ...
	 *     ), ...
	 * )
	 * }}}
	 *
	 * The resource name or the permission may be the single character `'*'`
	 * which acts as a wildcard.
	 *
	 * @param  array $acls  The logged in user's ACLs - see method description for format
	 * @return void
	 */
	static public function setUserACLs($acls)
	{
		fSession::set(__CLASS__ . '::user_acls', $acls);
		fSession::regenerateID();
	}
	
	
	/**
	 * Sets the authorization level for the logged in user
	 * 
	 * @param  string $level  The logged in user's auth level
	 * @return void
	 */
	static public function setUserAuthLevel($level)
	{
		self::validateAuthLevel($level);
		fSession::set(__CLASS__ . '::user_auth_level', $level);
		fSession::regenerateID();
	}
	
	
	/**
	 * Sets some piece of information to use to identify the current user
	 * 
	 * @param  mixed $token  The user's token. This could be a user id, an email address, a user object, etc.
	 * @return void
	 */
	static public function setUserToken($token)
	{
		fSession::set(__CLASS__ . '::user_token', $token);
		fSession::regenerateID();
	}


	/**
	 * Makes sure auth levels have been set, and that the specified auth level is valid
	 *
	 * @param  string $level  The level to validate
	 * @return void
	 */
	static private function validateAuthLevel($level=NULL)
	{
		if (self::$levels === NULL) {
			throw new fProgrammerException(
				'No authorization levels have been set, please call %s',
				__CLASS__ . '::setAuthLevels()'
			);
		}
		if ($level !== NULL && !isset(self::$levels[$level])) {
			throw new fProgrammerException(
				'The authorization level specified, %1$s, is invalid. Must be one of: %2$s.',
				$level,
				join(', ', array_keys(self::$levels))
			);
		}
	}
	
	
	/**
	 * Makes sure a login page has been defined
	 * 
	 * @return void
	 */
	static private function validateLoginPage()
	{
		if (self::$login_page === NULL) {
			throw new fProgrammerException(
				'No login page has been set, please call %s',
				__CLASS__ . '::setLoginPage()'
			);
		}
	}


	/**
	 * Forces use as a static class
	 *
	 * @return sigId
	 */
	private function __construct() { }
}



/**
 * Copyright (c) 2007-2011 Will Bond <will@flourishlib.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

 #
# Portable PHP password hashing framework.
#
# Version 0.3 / genuine.
#
# Written by Solar Designer <solar at openwall.com> in 2004-2006 and placed in
# the public domain.  Revised in subsequent years, still public domain.
#
# There's absolutely no warranty.
#
# The homepage URL for this framework is:
#
#	http://www.openwall.com/phpass/
#
# Please be sure to update the Version line if you edit this file in any way.
# It is suggested that you leave the main version number intact, but indicate
# your project name (after the slash) and add your own revision information.
#
# Please do not change the "private" password hashing method implemented in
# here, thereby making your hashes incompatible.  However, if you must, please
# change the hash type identifier (the "$P$") to something different.
#
# Obviously, since this code is in the public domain, the above are not
# requirements (there can be none), but merely suggestions.
#
class PasswordHash {
	var $itoa64;
	var $iteration_count_log2;
	var $portable_hashes;
	var $random_state;

	function PasswordHash($iteration_count_log2, $portable_hashes)
	{
		$this->itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

		if ($iteration_count_log2 < 4 || $iteration_count_log2 > 31)
			$iteration_count_log2 = 8;
		$this->iteration_count_log2 = $iteration_count_log2;

		$this->portable_hashes = $portable_hashes;

		$this->random_state = microtime();
		if (function_exists('getmypid'))
			$this->random_state .= getmypid();
	}

	function get_random_bytes($count)
	{
		$output = '';
		if (is_readable('/dev/urandom') &&
		    ($fh = @fopen('/dev/urandom', 'rb'))) {
			$output = fread($fh, $count);
			fclose($fh);
		}

		if (strlen($output) < $count) {
			$output = '';
			for ($i = 0; $i < $count; $i += 16) {
				$this->random_state =
				    md5(microtime() . $this->random_state);
				$output .=
				    pack('H*', md5($this->random_state));
			}
			$output = substr($output, 0, $count);
		}

		return $output;
	}

	function encode64($input, $count)
	{
		$output = '';
		$i = 0;
		do {
			$value = ord($input[$i++]);
			$output .= $this->itoa64[$value & 0x3f];
			if ($i < $count)
				$value |= ord($input[$i]) << 8;
			$output .= $this->itoa64[($value >> 6) & 0x3f];
			if ($i++ >= $count)
				break;
			if ($i < $count)
				$value |= ord($input[$i]) << 16;
			$output .= $this->itoa64[($value >> 12) & 0x3f];
			if ($i++ >= $count)
				break;
			$output .= $this->itoa64[($value >> 18) & 0x3f];
		} while ($i < $count);

		return $output;
	}

	function gensalt_private($input)
	{
		$output = '$P$';
		$output .= $this->itoa64[min($this->iteration_count_log2 +
			((PHP_VERSION >= '5') ? 5 : 3), 30)];
		$output .= $this->encode64($input, 6);

		return $output;
	}

	function crypt_private($password, $setting)
	{
		$output = '*0';
		if (substr($setting, 0, 2) == $output)
			$output = '*1';

		$id = substr($setting, 0, 3);
		# We use "$P$", phpBB3 uses "$H$" for the same thing
		if ($id != '$P$' && $id != '$H$')
			return $output;

		$count_log2 = strpos($this->itoa64, $setting[3]);
		if ($count_log2 < 7 || $count_log2 > 30)
			return $output;

		$count = 1 << $count_log2;

		$salt = substr($setting, 4, 8);
		if (strlen($salt) != 8)
			return $output;

		# We're kind of forced to use MD5 here since it's the only
		# cryptographic primitive available in all versions of PHP
		# currently in use.  To implement our own low-level crypto
		# in PHP would result in much worse performance and
		# consequently in lower iteration counts and hashes that are
		# quicker to crack (by non-PHP code).
		if (PHP_VERSION >= '5') {
			$hash = md5($salt . $password, TRUE);
			do {
				$hash = md5($hash . $password, TRUE);
			} while (--$count);
		} else {
			$hash = pack('H*', md5($salt . $password));
			do {
				$hash = pack('H*', md5($hash . $password));
			} while (--$count);
		}

		$output = substr($setting, 0, 12);
		$output .= $this->encode64($hash, 16);

		return $output;
	}

	function gensalt_extended($input)
	{
		$count_log2 = min($this->iteration_count_log2 + 8, 24);
		# This should be odd to not reveal weak DES keys, and the
		# maximum valid value is (2**24 - 1) which is odd anyway.
		$count = (1 << $count_log2) - 1;

		$output = '_';
		$output .= $this->itoa64[$count & 0x3f];
		$output .= $this->itoa64[($count >> 6) & 0x3f];
		$output .= $this->itoa64[($count >> 12) & 0x3f];
		$output .= $this->itoa64[($count >> 18) & 0x3f];

		$output .= $this->encode64($input, 3);

		return $output;
	}

	function gensalt_blowfish($input)
	{
		# This one needs to use a different order of characters and a
		# different encoding scheme from the one in encode64() above.
		# We care because the last character in our encoded string will
		# only represent 2 bits.  While two known implementations of
		# bcrypt will happily accept and correct a salt string which
		# has the 4 unused bits set to non-zero, we do not want to take
		# chances and we also do not want to waste an additional byte
		# of entropy.
		$itoa64 = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		$output = '$2a$';
		$output .= chr(ord('0') + $this->iteration_count_log2 / 10);
		$output .= chr(ord('0') + $this->iteration_count_log2 % 10);
		$output .= '$';

		$i = 0;
		do {
			$c1 = ord($input[$i++]);
			$output .= $itoa64[$c1 >> 2];
			$c1 = ($c1 & 0x03) << 4;
			if ($i >= 16) {
				$output .= $itoa64[$c1];
				break;
			}

			$c2 = ord($input[$i++]);
			$c1 |= $c2 >> 4;
			$output .= $itoa64[$c1];
			$c1 = ($c2 & 0x0f) << 2;

			$c2 = ord($input[$i++]);
			$c1 |= $c2 >> 6;
			$output .= $itoa64[$c1];
			$output .= $itoa64[$c2 & 0x3f];
		} while (1);

		return $output;
	}

	function HashPassword($password)
	{
		$random = '';

		if (CRYPT_BLOWFISH == 1 && !$this->portable_hashes) {
			$random = $this->get_random_bytes(16);
			$hash =
			    crypt($password, $this->gensalt_blowfish($random));
			if (strlen($hash) == 60)
				return $hash;
		}

		if (CRYPT_EXT_DES == 1 && !$this->portable_hashes) {
			if (strlen($random) < 3)
				$random = $this->get_random_bytes(3);
			$hash =
			    crypt($password, $this->gensalt_extended($random));
			if (strlen($hash) == 20)
				return $hash;
		}

		if (strlen($random) < 6)
			$random = $this->get_random_bytes(6);
		$hash =
		    $this->crypt_private($password,
		    $this->gensalt_private($random));
		if (strlen($hash) == 34)
			return $hash;

		# Returning '*' on error is safe here, but would _not_ be safe
		# in a crypt(3)-like function used _both_ for generating new
		# hashes and for validating passwords against existing hashes.
		return '*';
	}

	function CheckPassword($password, $stored_hash)
	{		
		$hash = $this->crypt_private($password, $stored_hash);
		
		if ($hash[0] == '*')
			$hash = crypt($password, $stored_hash);
		return $hash == $stored_hash;
	}
}

