const API_BASE = 'https://finarix.onrender.com/api';

// Token helpers
function getToken(){ return localStorage.getItem('token'); }
function setToken(t){ if (t) localStorage.setItem('token', t); }
function clearToken(){ localStorage.removeItem('token'); }

// Generic API
async function api(path,{method='GET',body,auth=true,headers={}}={}){
  const h={'Content-Type':'application/json',...headers};
  if(auth){
    const t=getToken();
    if(t)h.Authorization='Bearer '+t;
  }

  const res=await fetch(API_BASE+path,{
    method,headers:h,
    body:body?JSON.stringify(body):undefined,
    mode:'cors',credentials:'omit'
  });

  const text=await res.text();
  let data;try{data=JSON.parse(text);}catch{data=text;}

  if(!res.ok){
    const msg=(data&&(data.message||data.error))||res.statusText;
    throw new Error(msg);
  }
  return data;
}

// Auth helpers
async function apiRegister(name,email,password){
  return api('/auth/register',{method:'POST',auth:false,body:{name,email,password}});
}

async function apiLogin(email,password){
  const out=await api('/auth/login',{method:'POST',auth:false,body:{email,password}});
  const token=out.accessToken||out.token;
  if(!token)throw new Error('Kein Token erhalten');
  setToken(token);
  return out;
}

// Export global
window.api=api;
window.apiRegister=apiRegister;
window.apiLogin=apiLogin;
window.getToken=getToken;
window.clearToken=clearToken;

console.log('[api.js] LOADED',API_BASE);
