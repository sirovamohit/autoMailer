const axios = require("axios");
const XLSX = require("xlsx");
const { sendApplicationEmail } = require("../utils/sendMail");
const { google } = require("googleapis");
const keys = require("../../service-key.json");

async function clearSheet() {
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Step 1: Get number of rows
  const getRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1",
  });

  const totalRows = getRes.data.values?.length || 0;

  if (totalRows <= 1) {
    throw new Error("Nothing to clear, only header exists.");
  }

  // Step 2: Delete all rows except row 1
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // Sheet1 is usually sheetId 0
              dimension: "ROWS",
              startIndex: 1, // Row index starts at 0 → row 2 = index 1
              endIndex: totalRows,
            },
          },
        },
      ],
    },
  });
}

const getExcelRows = async () => {
  const fileUrl = process.env.GOOGLE_SHEET_URL;

  // Fetch the file as arraybuffer
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
  });

  const excelBuffer = response.data;

  // Read workbook from buffer
  const workbook = XLSX.read(excelBuffer, { type: "buffer" });

  // First sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert sheet → JSON
  let rows = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });

  // Remove Excel Table header row (it contains A,B,C and __EMPTY)
  rows = rows.filter((r) => r.A !== "Company Name");

  // Now convert columns A,B,C → meaningful keys:
  rows =
    rows
      ?.map((r) => ({
        companyName: r.A,
        companyEmail: r.B,
        name: r.C,
        type: r.D,
      }))
      ?.filter((item) => item?.companyEmail) || [];

  return rows;
};

const sendMailToAll = async () => {
  try {
    const rows = await getExcelRows();
    const promises = rows.map((row) =>
      sendApplicationEmail(
        row?.companyEmail,
        row?.companyName,
        row?.name,
      ),
    );
    const results = await Promise.allSettled(promises);
    if (results?.length) {
      await clearSheet();
      return results;
    }
  } catch (error) {
    console.log(error);
  }
};

exports.sendMail = async () => {
  const res = await sendMailToAll();
  return res;
};
