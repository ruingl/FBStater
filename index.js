// Rui

const config = require('./config/config.json');
const request = require('request');
const cheerio = require('cheerio');

async function main() {
  try {
    await getCookie(
      email: config.account.email,
      password: config.account.password
    ), (error, fbstate) => {
      if (error) {
        console.error(error);
        // return;
      };

      if (fbstate) {
        console.log(fbstate);
      } else {
        console.log("Incorrect email / password!");
      };
    });
  } catch (error) {
    console.error(error);
  };
};

async function getCookie(email, password, callback) {
  const url = 'https://mbasic.facebook.com';
  const xurl = url + '/login.php';
  const userAgent = "Mozilla/5.0 (Linux; Android 4.1.2; GT-I8552 Build/JZO54K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36";
  const headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en_US',
    'cache-control': 'max-age=0',
    'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': "Windows",
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': userAgent
  };

  const jar = request.jar();

  request({ url: xurl, headers: headers, jar: jar }, (error, response, body) => {
    if (error) {
      console.error('Initial request error:', error);
      return callback(error);
    }

    const $ = cheerio.load(body);
    const lsd = $('input[name="lsd"]').val();
    const jazoest = $('input[name="jazoest"]').val();
    const m_ts = $('input[name="m_ts"]').val();
    const li = $('input[name="li"]').val();
    const try_number = $('input[name="try_number"]').val();
    const unrecognized_tries = $('input[name="unrecognized_tries"]').val();
    const bi_xrwh = $('input[name="bi_xrwh"]').val();

    if (!lsd || !jazoest || !m_ts || !li || !try_number || !unrecognized_tries || !bi_xrwh) {
      console.error('Failed to extract form inputs');
      return callback(new Error('Failed to extract form inputs'));
    }

    const formData = {
      lsd: lsd,
      jazoest: jazoest,
      m_ts: m_ts,
      li: li,
      try_number: try_number,
      unrecognized_tries: unrecognized_tries,
      bi_xrwh: bi_xrwh,
      email: email,
      pass: password,
      login: "submit"
    };

    request.post({ url: xurl, headers: headers, form: formData, followAllRedirects: true, timeout: 300000, jar: jar }, (error, response, body) => {
      if (error) {
        console.error('Login request error:', error);
        return callback(error);
      }

      const cookies = jar.getCookies(url);
      const cok = cookies.map(cookie => ({
        key: cookie.key,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        hostOnly: !cookie.domain.startsWith('.'),
        creation: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      }));
      const fbstate = JSON.stringify(cok, null, 4);

      if (cok.some(cookie => cookie.key === "c_user") {
        return callback(null, fbstate); 
      } else {
        return callback(null, null);
      };
    });
  });
};

main();
