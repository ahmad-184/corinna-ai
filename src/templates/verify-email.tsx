export default function verifyEmailTemplate({ code }: { code: string }) {
  return `<html lang="en">
      <body style="background-color: #fff; padding: 48px 32px 48px 32px">
        <td align="left" class="esd-structure es-p30t es-p30b es-p20r es-p20l">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td width="560" align="center" valign="top" class="esd-container-frame">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                  <tr>
                    <td align="center" class="esd-block-image" style="font-size: 0">
                      <a target="_blank">
                        <img src="https://res.cloudinary.com/dzml3ymzi/image/upload/v1726524678/tafhchfiih33wtrekjva.png" alt="" width="100">
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" class="esd-block-text es-m-txt-c">
                      <h1 style="font-size:46px;margin:0px;">
                        Verification code
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" class="esd-block-text es-p40r es-p40l es-m-p0r es-m-p0l es-p30b">
                      <p style="margin:0px 0px 30px 0px;font: bold;font-size: 40px;">
                          ${code}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" class="esd-block-button es-p10">
                      <p>This code will expire after 10 minutes</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
      </body>
    </html>
    `;
}
