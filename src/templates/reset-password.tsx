export default function resetPasswordTemplate({ link }: { link: string }) {
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
                          Reset your password
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-m-txt-c">
                        <p style="font-size:19px;margin:0px 0px 25px 0px;">
                          After click button blow you can reset your password
                        </p>
                      </td>
                    </tr>
                    <tr>
                  <td align="center" class="esd-block-button es-p10">
                    <span class="es-button-border" style="border-radius: 6px; background: #5376df">
                      <a href="${link}" target="_blank" class="es-button" style="color:white;text-decoration:none;border-radius: 6px; background: #5376df; mso-border-alt: 10px solid #5376df; font-size: 16px; padding: 15px 60px">
                        Click here
                      </a>
                    </span>
                  </td>
                </tr>
                    <tr>
                      <td align="center" class="esd-block-button es-p10">
                        <p>This link will expire after 10 minutes</p>
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
