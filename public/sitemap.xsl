<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - The Daily Pulse</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 40px 20px;
            background-color: #f8fafc;
          }
          .container {
            max-w: 1200px; 
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          }
          h1 {
            color: #D42D2D;
            margin-bottom: 10px;
            font-size: 28px;
          }
          p {
            margin-top: 0;
            color: #64748b;
            line-height: 1.6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
          }
          th, td {
            text-align: left;
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
          }
          th {
            background-color: #f1f5f9;
            font-weight: 600;
            color: #475569;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 0.05em;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
            color: #1d4ed8;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            background: #e2e8f0;
            color: #475569;
            margin-right: 4px;
            margin-top: 4px;
          }
          .badge-news { background: #dbeafe; color: #1e40af; }
          .badge-image { background: #dcfce7; color: #1e3a8a; }
          
          .meta-info {
            font-size: 13px;
            color: #64748b;
            margin-top: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>The Daily Pulse XML Sitemap</h1>
          <p>This sitemap is automatically generated to help search engines discover and index pages on this website, including Articles, Categories, and Static Pages.</p>
          <p><strong>Total URLs: </strong> <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></p>
          <table>
            <thead>
              <tr>
                <th>URL Details</th>
                <th>Last Modified</th>
                <th>Priority</th>
                <th>Update Freq</th>
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
                    
                    <div style="margin-top: 6px;">
                      <!-- Image check -->
                      <xsl:if test="image:image">
                        <span class="badge badge-image">Includes Image</span>
                      </xsl:if>
                      <!-- News check -->
                      <xsl:if test="news:news">
                        <span class="badge badge-news">News Article</span>
                        <div class="meta-info">
                          Headline: <xsl:value-of select="news:news/news:title"/>
                        </div>
                      </xsl:if>
                    </div>
                  </td>
                  <td>
                    <xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)))"/>
                  </td>
                  <td><xsl:value-of select="sitemap:priority"/></td>
                  <td style="text-transform: capitalize;"><xsl:value-of select="sitemap:changefreq"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
