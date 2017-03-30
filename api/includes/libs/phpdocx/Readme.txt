====PHPdocX 3.1 by 2mdc.com====
http://www.phpdocx.com/

PHPDOCX is a PHP library designed to dynamically generate reports in Word format (WordprocessingML).

The reports may be built from any available data source like a MySQL database or a spreadsheet. The resulting documents remain fully editable in Microsoft Word (or any other compatible software like Open Office) and therefore the final users are able to modify them as necessary.

The formatting capabilities of the library allow the programmers to generate dynamically and programmatically all the standard rich formatting of a typical word processor.

This library also provides an easy method to generate documents in other standard formats such as PDF or HTML.


====What's new on PHPdocX 3.1?====

This new version includes quite a few new features that you may find interesting:

- It is now posible to insert arbitrary content within a paragraph with the updated addText method:
      * multiple runs of text with diverse formatting options (color, bold, size, ...)
      * inline or floating images and charts that may be carefully positioned  thanks to the new vertical and horizontal offset parameters
      * page numbers and current date
      * footnotes and endnotes
      * line breaks and column breaks
      * links and bookmarks
      * inline HTML content
      * shapes
- In general the new addText method accepts any inline WordML fragment. This will make trivial to insert new elements in paragraphs as they are integrated in PHPDocX.
- We have greatly improved the automatic generation of the table of Contents via the addTableContents method. One may now:
      * request automatic updating of the TOC on the first openning of the document (the user will be automatically prompted to update fields in the Word document)
      * limit the TOC levels that should be shown (the default value is all)
      * import the TOC formatting from an existing Word document
- The addTemplateImage has now more configuration options so it is no longer necessary to include a placeholder image with the exact size and dpi in the PHPDocX Word template. Moreover one can now use the same generic placehorder image for the whole document simplifying considerably the process.
- The logging framework has been updated to the latest stable version of log4php.
- You may now use an external script to transform DOCX into PDF using TransformDocAdv.inc class. This script fixes the problems related to runnig system commands using Apache or any other not CGI/FastCGI web server.

Besides these improvements v3.1 also offers:
- Minor improvements in the HTML to Word conversion: one may change the orientation of text within a table cell and avoid the splitting of a table row between pages.
- New configuration options for the addImage method
- Now it is simpler to link internal bookmarks with the addLink method
- When merging two Word documents one can choose to insert line breaks between them to clearly separate the contents
- One may import styles using also their id (this may simplify some tasks)
- Minor bug fixes

3.0 PRO VERSION

This version includes substantial changes that have required that this new version were not fully backwards compatible with the latest v2.7.

Nevertheles the changes in the API are not difficult to implement in already existing scripts and the advantages are multiple.

The main changes are summarized as follows:

- The new version handles in a different way the embedding of Word elements within other elements like tables, lists and headers/footers. The 
majority of methods have now a 'rawWordML' option that in combination with the new 'createWordMLFragment' allows for the generation of chunks of 
WordMl code that can be inserted with great flexibility anywhere within the Word document. its is now, for example, trivial to include paragraphs, 
charts, tables, etcetera in a table cell.
-One may create sophisticated headers and footers with practically no restriction whatsoever by the use of the 'createWordMLFragment'  method.
-The embedHTML and replaceTemplateVariableByHTML have been improved to include practically all CSS styles and parse floats. It is also posible now 
to filter the HTML content via XPath expressions and associate different native Word styles to individual CSS classes, ids or HTML tags.
-New chart types have been included: scatter, bubbles, donoughts and the code has been refactor to allow for greater flexibility.
-The addsection method has been extended and improved.
-The addTextBox method has been greatly improved to include many more formatting options.
-The refactored addText method allows for the introduction of line breaks inside a paragraph.
-New addPageNumber method
-New addDateAndHour method

2.7 PRO VERSION

The main differences with respect the prior stable major version PHPDocX v2.6 can be summarized as follows:

- New chart types: percent stacked bar and col charts and double pie charts (pie or bar chart for the second one)
- Improvements in the HTML parser (floating tables, new CSS properties implemented)
- Now is posible to insert watermarks (text and/or images)
- New CryptoPHPDocX class (only CORPORATE) that allos for password protected docuemnts
- Automatic leaning of temporary files
- New method: setColorBackgraound to modify the background color of a Word document
- Several other minor improvements and bug fixes

2.6 PRO VERSION

The main improvements are:

New and more powerfull conversion plugin for PRO+ and CORPORATE packages.
New HTML parser engine for the embedding of HTML into Word: 20% faster and up to 50% less RAM consumption.
New HTML tags and properties parsed (now covering practically the whole standard):
 -HTML headings become true Word headings
 -Flaoting images are now embedded as floated images in Word
 -Anchors as parsed as links and bookmarks
 -Web forms are converted into native Word forms
 -Horizontal rulers are also parsed into Word
 -Several other minor improvements and bug fixes
New addParagraph method that allows to create complex paragraphs that may include:
 -Formatted text
 -Inline or floating images
 -Links
 -Bookmarks
 -Footnotes and endnotes
New addBookmark method
Improvements in the DocxUtilities class (only PRO+ and Corporate licenses): improved merging capabilities that cover documents with charts, images, footnotes, comments, lists, headers and footers, etcetera.

2.5.2 FREE VERSION
- Docx to TXT to convert Docx documents to pure text

2.5.2 PRO VERSION
- New format converter for Windows (MS Word must be installed)
- Now you can replace the image in headers
- New method DocxtoTXT to convert docx documents to pure text
- Better implementation of HTML to WORDML
- Bug fixes

2.5.1 PRO VERSION
One of the most demanded functionalities by PHPDocX users is the posibility to generate Word documents out of HTML retaining the format and construct documents with different HTML blocks. Now we give a little step to make this functionality more powerful.

Since the launch of the 2.5.1 version of PHPDocX we have at your disposal two new methods: embedHTML() and replaceTemplateVariableByHTML() - new on this version- that allow to convert HTML into Word with a high degree of customization.

Moreover this conversion is obtained by direct translation of the HTML code into WordProcessingML (the native Word format) so the result is fully compatible with Open Office (and all its avatars), the Microsoft compatibility pack for Word 2003 and most importantly with the conversion to PDF, DOC, ODT and RTF included in the library.

2.5 PRO VERSION
This version of PHPDocX includes several enhancements that will greatly simplify the generation of Word documents with PHP.
The main improvements can be summarized as follows:
- New embedHTML method that:
	o Directly translates HTML into WordProcessingXML.
	o Allows to use native Word Styles, i.e. we may require that the HTML tables are formatted following a standard Word table style.
	o Is compatible with OpenOffice and the Word 2003 compatibility pack.
	o May download external HTML pages (complete or selected portions) embedding their images into the Word document.

- PHPDocX v2.5.1 now uses base templates that allow:
	o To use all standard Word styles for:
		- Paragraphs.
		- Tables with special formatting for first and last rows and columns, banded rows and columns and another standard features.
		- Lists with several different numbering styles.
		- Footnotes and endnotes.
	o Include standard headings (numbered or not).
	o Include customized headers and footers as well as front pages.

- There are new methods that allow you to parse all the available styles of a Word document and import them into your base template:
	o parseStyles  generates a Word document with all the available styles as well as the required PHPDocX code to use them in your final Word document (you may download here the result of this method applied to the default PHPDocX base template).
	o importStyles allows to integrate new styles  extracted from an external Word document into your base template.

- New conversion plugin (based on OpenOffice) that improves the generation of PDFs, RTFs and legacy versions of Word documents.

- New standardized page layout properties (A4, A3, letter, legal and portrait/landscape modes) trough the new modifyPageLayout method.

- The addTemplate method has been upgraded to greatly improve its performance.

- You may directly import sophisticated headers and footers from an existing Word document with the new  importHeadersAndFooters method.

As well as many other minor fixes and improvements.
We have also upgraded our documentation section by simplifying the access to the available library examples and we have included a tutorial that will help newcomers to get grasp of the power of PHPDocX.

====What are the minimum technical requirements?====
To run PHPDocX you need to have a functional LAMP setup, this should include:

- PHP5
- Required : Support ZipArchive and XSLT
- A data source such as a MySQL database, an Excel spreadsheet or an CSV file.
- Apache 2.x +

====LICENSES====
PhpdocX is available under four different licenses:

- Free. LGPL licensed (http://www.gnu.org/licenses/lgpl.html): this is the most economical way to access PHPdocX and allows you to try many of its functions without limitations. It can be downloaded for free from http://www.phpdocx.com

- Pro: Priced at USD 99, PhpdocX Pro version adds many customizable features.

- Pro + Conversion plugin: Priced at USD 149. Same as PRO plus advanced conversion to PDF, DOC, HTML, ODF and RTF.

- Corporate: Priced at USD 399. Same as PRO plus but valid for all subdomains of the licensed domain. Include the Conversion Plugin.

====What are the main differences between PHPdocX Free and PHPdocX Pro?====
PHPdocX Free allows you to dynamically generate docx files with simple formating options such as lists, page numbering and tables, no watermarks are embedded and there is no trial period or limit in the amount of documents you can generate. PHPdocX Pro extends this functionality and allows you to include nested lists, text boxes, customized headers and footers, 3D graphs, MathML features and it also allows you to create Word 97 - 2004 .doc documents.

You can access a table comparing the features of the free version and the Pro version at: http://www.phpdocx.com/features

You can download the Free, LGPL version or the Pro Version from http://www.phpdocx.com/

PHPDocX is developed by 2mdc (http://www.2mdc.com).