const SS_ID        = '1AGZd1wI21OckwmLGCFgSCDY3lyAVnXzRcVP8dOnlJTY';
const SHEET_NAME   = '夏期講習問い合わせ';
const CHAT_WEBHOOK = 'https://chat.googleapis.com/v1/spaces/AAQAlHXjj5g/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=4V3yLik2pzZ0YIjbgXSO9zmtOB7giI2_O7LZG8xkgwg';

function doPost(e) {
  const ss    = SpreadsheetApp.openById(SS_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

  const data = JSON.parse(e.postData.contents);

  // スプレッドシートに記録
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.contact,
    data.grade,
    data.classroom,
    data.request,
    data.message || ''
  ]);

  // Google Chat に通知
  const message = '🔔 *夏期講習 新規問い合わせ*\n\n' +
    '👤 お子さまのお名前：' + data.name + '\n' +
    '📞 連絡先：' + data.contact + '\n' +
    '🎓 学年：' + data.grade + '\n' +
    '🏫 希望教室：' + data.classroom + '\n' +
    '📋 ご希望内容：' + data.request + '\n' +
    '💬 メッセージ：' + (data.message || 'なし') + '\n' +
    '🕐 受信日時：' + data.timestamp;

  UrlFetchApp.fetch(CHAT_WEBHOOK, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ text: message })
  });

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
