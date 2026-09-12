export default async (request) => {
  if (request.method !== "POST") return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers:{"Content-Type":"application/json"}});
  try {
    const {amount}=await request.json(), value=Number(amount);
    if(!Number.isFinite(value)||value<1||value>10000)return new Response(JSON.stringify({error:"Suma invalida."}),{status:400,headers:{"Content-Type":"application/json"}});
    const key=Netlify.env.get("REVOLUT_SECRET_KEY");
    if(!key)return new Response(JSON.stringify({error:"REVOLUT_SECRET_KEY nu este configurata in Netlify."}),{status:500,headers:{"Content-Type":"application/json"}});
    const r=await fetch("https://sandbox-merchant.revolut.com/api/orders",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json","Revolut-Api-Version":"2026-03-12"},body:JSON.stringify({amount:Math.round(value*100),currency:"EUR"})});
    const d=await r.json();
    return new Response(JSON.stringify({id:d.id,state:d.state,checkout_url:d.checkout_url||d.checkoutUrl||null,error:d.error||d.message||null}),{status:r.status,headers:{"Content-Type":"application/json"}});
  } catch(e){return new Response(JSON.stringify({error:e.message}),{status:500,headers:{"Content-Type":"application/json"}})}
};
