import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const token = formData.get("g-recaptcha-response");

  if (!token) {
    return new Response("Captcha requerido", { status: 400 });
  }

  const secret = import.meta.env.RECAPTCHA_SECRET;

  const verify = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secret}&response=${token}`,
    },
  );

  const data = await verify.json();

  if (!data.success) {
    return new Response("Captcha inválido", { status: 400 });
  }

  return new Response("Formulario enviado correctamente");
};
