<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          h1 {
            color: #D42D2D;
            margin-bottom: 5px;
          }
          p {
            margin-top: 0;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th, td {
            text-align: left;
            padding: 12px 15px;
            border-bottom: 1px solid #eaeaea;
          }
          th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #444;
          }
          tr:hover {
            background-color: #f9f9f9;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div style="max-w: 1200px; margin: 0 auto;">
          <h1>XML Sitemap</h1>
          <p>This sitemap is automatically generated to help search engines discover and index pages on this website.</p>
          <p>Number of URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Priority</th>
                <th>Change Frequency</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                  </td>
                  <td><xsl:value-of select="sitemap:priority"/></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
