const { chromium } = require("playwright");
const timers = require("timers/promises");
const { email } = require("./email");

(async () => {
  const executions = [];
  let contador = 0;

  const infoToString = (executionsArr) => {
    let executionsString = "";
    executionsArr.forEach((elem, index) => {
      executionsString += `Intento ${index + 1}:\nFecha: ${
        elem.date
      }\nCita disponible: ${elem.availableAppointment}\n\n`;
    });
    return executionsString;
  };

  const inform = async () => {
    await email(
      "Informe de búsqueda de cita en Oficina de Extranjería 🇪🇸",
      `${infoToString(executions)}`
    );
  };

  const scrapping = async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);
    try {
      await page.goto(
        "https://icp.administracionelectronica.gob.es/icpplus/index.html"
      );
      //Primera página
      await page.waitForLoadState();
      await page
        .getByLabel("PROVINCIAS DISPONIBLES")
        .selectOption("Valladolid");
      await timers.setTimeout(5000);
      await page.getByRole("button", { name: "Aceptar" }).click();

      //Segunda página
      await page.waitForLoadState();
      await page
        .getByLabel("Oficina:")
        .selectOption(
          "OFICINA DE EXTRANJERÍA - VALLADOLID, Arzobispo José Delicado, 7"
        );
      await page.waitForLoadState();
      await page
        .getByLabel("TRÁMITES OFICINAS DE EXTRANJERÍA")
        .selectOption("SOLICITUD DE AUTORIZACIONES");
      await timers.setTimeout(5000);
      await page.getByRole("button", { name: "Aceptar" }).click();

      //Tercera página
      await page.waitForLoadState();
      await timers.setTimeout(5000);
      await page.getByRole("button", { name: "Entrar" }).click();

      //Cuarta página
      await page.waitForLoadState();
      await page.getByLabel("N.I.E.Campo obligatorio").fill("Z0071098X");
      await page
        .getByLabel("Nombre y apellidos")
        .fill("Jhon Esteban Cardona Agudelo");
      await page.getByLabel("Año de nacimiento").fill("2001");
      await timers.setTimeout(5000);
      await page.getByRole("button", { name: "Aceptar" }).click();

      //Quinta página
      await page.waitForLoadState();
      await timers.setTimeout(5000);
      await page.getByRole("button", { name: "Solicitar Cita" }).click();

      //Sexta página
      await page.waitForLoadState();
      await page.getByLabel("Teléfono").fill("744407597");
      await page.getByLabel(/e-Mail[\s\S]*/gi).fill("jhone2001@gmail.com");
      await page
        .getByLabel(/Repita e-Mail[\s\S]*/gi)
        .fill("jhone2001@gmail.com");
      await page
        .getByLabel("Motivo o tipo de solicitud de la cita")
        .fill("Solicitud arraigo para la formación");
      await timers.setTimeout(5000);
      await page.getByRole("button", { name: "Siguiente" }).click();

      //Séptima página
      await page.waitForLoadState();
      await page.getByLabel("CITA 1 ").check();
    } catch (error) {
      executions[contador] = {
        date: Date(),
        availableAppointment: `Página web no disponible.`,
      };
      contador++;
      console.log(infoToString(executions));
      await page.close();
      await browser.close();
      return;
    }
    //Screenshot
    await page.screenshot({ path: "extranjeria.png" });

    //Fecha de cita
    let cita = await page.innerText("#cita_1");
    cita = cita.replaceAll("\n", " ");
    const citaArr = cita.split(" ");

    //Email y ejecuciones
    if (citaArr[3].substring(3) == "03/2023") {
      await email(
        "¡Cita disponible! 🙂",
        `
      Después de los siguientes ${contador + 1} intentos:\n${infoToString(executions)}Hay una cita disponible para el mes de marzo, la cita es la ${cita}`
      );
      clearInterval(scrappingID);
      clearInterval(informID);
    } else {
      executions[contador] = {
        date: Date(),
        availableAppointment: cita,
      };
      contador++;
      console.log(infoToString(executions));
      await page.close();
      await browser.close();
    }
  };
  await scrapping();
  const scrappingID = setInterval(scrapping, 300000);
  const informID = setInterval(inform, 3600000);
})();
