function doPost(e) {
  if (!e || !e.parameter) return ContentService.createTextOutput("No data");

  const data = e.parameter;
  const recipient = "alandiegoclavijo@gmail.com";
  const subject = "🚀 Contacto Portafolio: " + (data.name || "Nuevo Mensaje");

  const body = `
    Nombre: ${data.name}
    Email: ${data.email}
    Mensaje: ${data.message}
  `;

  try {
    GmailApp.sendEmail(recipient, subject, body);
    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error" }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
