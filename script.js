const vietnamese =
  "ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵÁÀẢÃẠẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ";

const base = () => {
  const punct = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
  const lettersLower = Array.from(Array(26))
    .map((_, i) => String.fromCharCode(97 + i))
    .join("");
  const lettersUpper = lettersLower.toUpperCase();
  const digits = "0123456789";
  const whitespace = " \n\t";
  let s = lettersLower + lettersUpper + digits + punct + whitespace;
  for (const ch of vietnamese) if (!s.includes(ch)) s += ch;
  return s;
};

function passwordToShift(password) {
  const alph = base();
  let sum = 0;
  for (const ch of password) sum += ch.codePointAt(0);
  return alph.length ? sum % alph.length : 0;
}

function caesarTransform(text, shift) {
  const alph = base();
  const n = alph.length;
  const idx = Object.create(null);
  for (let i = 0; i < n; i++) idx[alph[i]] = i;

  let out = "";
  for (const ch of text) {
    if (idx[ch] !== undefined) {
      const newI = (idx[ch] + shift + n) % n;
      out += alph[newI];
    } else out += ch;
  }
  return out;
}

// DOM
const plaintextEl = document.getElementById("plaintext");
const passwordEncryptEl = document.getElementById("passwordEncrypt");
const btnEncrypt = document.getElementById("btnEncrypt");
const encryptedResult = document.getElementById("encryptedResult");
const btnCopyEncrypted = document.getElementById("btnCopyEncrypted");
const btnClearPlain = document.getElementById("btnClearPlain");

const ciphertextEl = document.getElementById("ciphertext");
const passwordDecryptEl = document.getElementById("passwordDecrypt");
const btnDecrypt = document.getElementById("btnDecrypt");
const decryptedResult = document.getElementById("decryptedResult");
const btnCopyDecrypted = document.getElementById("btnCopyDecrypted");
const btnClearCipher = document.getElementById("btnClearCipher");

btnEncrypt.addEventListener("click", () => {
  const text = plaintextEl.value || "";
  const pwd = passwordEncryptEl.value || "";
  if (!text) return (encryptedResult.textContent = "(vui lòng nhập văn bản)");
  if (!pwd) return (encryptedResult.textContent = "(vui lòng nhập mật khẩu)");
  const shift = passwordToShift(pwd);
  const cipher = caesarTransform(text, shift);
  encryptedResult.textContent = cipher;
});

btnDecrypt.addEventListener("click", () => {
  const cipher = ciphertextEl.value || "";
  const pwd = passwordDecryptEl.value || "";
  if (!cipher) return (decryptedResult.textContent = "(vui lòng dán đoạn mã hóa)");
  if (!pwd) return (decryptedResult.textContent = "(vui lòng nhập mật khẩu)");
  const shift = passwordToShift(pwd);
  const plain = caesarTransform(cipher, -shift);
  decryptedResult.textContent = plain;
});

btnCopyEncrypted.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(encryptedResult.textContent);
    alert("Đã sao chép");
  } catch {
    alert("Không thể sao chép tự động — hãy chọn và sao chép tay.");
  }
});

btnCopyDecrypted.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(decryptedResult.textContent);
    alert("Đã sao chép");
  } catch {
    alert("Không thể sao chép tự động — hãy chọn và sao chép tay.");
  }
});

btnClearPlain.addEventListener("click", () => {
  plaintextEl.value = "";
  encryptedResult.textContent = "(chưa có)";
  passwordEncryptEl.value = "";
});
btnClearCipher.addEventListener("click", () => {
  ciphertextEl.value = "";
  decryptedResult.textContent = "(chưa có)";
  passwordDecryptEl.value = "";
});

// demo
plaintextEl.value = "Không cãi, Không chọc, Không mượn đồ";
