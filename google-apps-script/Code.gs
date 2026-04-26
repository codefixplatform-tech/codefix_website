/**
 * CodeFix Conversion Engine v4 (Robust & CORS-Safe)
 * 
 * IMPORTANT SETUP INSTRUCTIONS:
 * 1. Create a new project at https://script.google.com/
 * 2. In the left sidebar, click '+' next to "Services" and add the "Drive API" (v3).
 * 3. Replace the default Code.gs with this file's contents.
 * 4. Replace the appsscript.json with the provided manifest file.
 * 5. Click "Deploy" -> "New Deployment".
 * 6. Set "Execute as" to "Me" and "Who has access" to "Anyone".
 * 7. Copy the Web App URL and update CONVERSION_API_URL in FileUpload.jsx.
 */

function doPost(e) {
  try {
    var data;
    // Handle both JSON and Form-data inputs for maximum compatibility
    if (e.parameter && e.parameter.jsonData) {
      data = JSON.parse(e.parameter.jsonData);
    } else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      throw new Error("No data received in request.");
    }

    var fileName = data.fileName;
    var base64Data = data.base64;
    var targetFormat = data.targetFormat; // 'pdf', 'docx', 'xlsx', 'pptx'
    
    var contentType = "";
    if (fileName.toLowerCase().endsWith(".pdf")) contentType = MimeType.PDF;
    else if (fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".doc")) contentType = MimeType.MICROSOFT_WORD;
    else if (fileName.toLowerCase().endsWith(".xlsx") || fileName.toLowerCase().endsWith(".xls")) contentType = MimeType.MICROSOFT_EXCEL;
    else if (fileName.toLowerCase().endsWith(".pptx") || fileName.toLowerCase().endsWith(".ppt")) contentType = MimeType.MICROSOFT_POWERPOINT;

    var decodedData = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decodedData, contentType, fileName);
    
    // 1. Upload to Drive (Drive API v3)
    var googleMimeType = "";
    if (contentType === MimeType.MICROSOFT_WORD) googleMimeType = MimeType.GOOGLE_DOCS;
    else if (contentType === MimeType.MICROSOFT_EXCEL) googleMimeType = MimeType.GOOGLE_SHEETS;
    else if (contentType === MimeType.MICROSOFT_POWERPOINT) googleMimeType = MimeType.GOOGLE_SLIDES;
    else if (contentType === MimeType.PDF) googleMimeType = MimeType.GOOGLE_DOCS; 

    var fileMetadata = {
      name: fileName,
      mimeType: googleMimeType
    };

    // Create the file in Google Drive (this performs the conversion)
    var file = Drive.Files.create(fileMetadata, blob);
    
    // 2. Export to target format
    var exportMimeType = "";
    if (targetFormat === "pdf") exportMimeType = MimeType.PDF;
    else if (targetFormat === "docx") exportMimeType = MimeType.MICROSOFT_WORD;
    else if (targetFormat === "xlsx") exportMimeType = MimeType.MICROSOFT_EXCEL;
    else if (targetFormat === "pptx") exportMimeType = MimeType.MICROSOFT_POWERPOINT;

    var exportUrl = "https://www.googleapis.com/drive/v3/files/" + file.id + "/export?mimeType=" + encodeURIComponent(exportMimeType);
    var response = UrlFetchApp.fetch(exportUrl, {
      method: "get",
      headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() }
    });
    
    var exportBlob = response.getBlob();
    var resultBase64 = Utilities.base64Encode(exportBlob.getBytes());
    
    // 3. Cleanup: Delete temp file
    Drive.Files.remove(file.id);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      base64: resultBase64,
      fileName: fileName.split('.')[0] + "." + targetFormat
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (f) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: f.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
