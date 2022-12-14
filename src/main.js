import "./css/index.css"
import IMask from "imask";

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path');
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path');
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');

function setCardType(type) {
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        default: ["black", "gray"],
    }

    ccBgColor01.setAttribute("fill", colors[type][0]);
    ccBgColor02.setAttribute("fill", colors[type][1]);     
    ccLogo.setAttribute("src", `cc-${type}.svg`);
}

setCardType("default")

// window.setCardType = setCardType;

const securityCode = document.getElementById('security-code');
const securityCodePattern = { mask: "0000" };
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.getElementById('expiration-date');
const expirationPattern = { 
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    }
  }
};

const expirationDateMasked = IMask(expirationDate, expirationPattern);

const cardNumber = document.getElementById('card-number');
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex));
    return foundMask;
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const cardHolder = document.querySelector('#card-holder');

cardHolder.addEventListener('input', (ev) => {
  const ccHolder = document.querySelector('.cc-holder .value');
  ccHolder.innerText = ev.target.value || "FULANO DA SILVA";
})

document.querySelector("form").addEventListener("submit", (ev) => {
  ev.preventDefault();
});

securityCodeMasked.on('accept', () => (
  updateSecurityCode(securityCodeMasked.value)
));

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector('.cc-security .value');
  ccSecurity.innerText = code || "123";
}

cardNumberMasked.on('accept', () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value)
});

function updateCardNumber(number) {
  const ccNumber = document.querySelector('.cc-number');
  ccNumber.innerText = number || "1234 5678 9012 3456";
}

expirationDateMasked.on('accept', () => {
  updateExpirationdate(expirationDateMasked.value);
});

function updateExpirationdate(date) {
  const ccExpiration = document.querySelector('.cc-extra .value');
  ccExpiration.innerText = date || "02/32";
}



// mastercard come??a com 5
// visa come??a com 4
