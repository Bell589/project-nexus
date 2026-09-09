import { useEffect, useState } from "react";
import { Home } from "./pages/Home";
import { WorldSelect } from "./pages/WorldSelect";
import { CharacterCreate } from "./pages/CharacterCreate";
import { CharacterSelect } from "./pages/CharacterSelect";
import { AuthPage } from "./pages/AuthPage";
import { Game } from "./pages/Game";
import { api } from "./api/client";
import type { Account, World, Character } from "./types/models";

type Step = { name: "select" } | { name: "home" } | { name: "world" } | { name: "create"; world: World } | { name: "game"; character: Character };
export default function App() {
  const [account,setAccount]=useState<Account|null>(null);
  const [step,setStep]=useState<Step>({name:"select"});
  const [restoring,setRestoring]=useState(api.hasStoredToken());
  useEffect(()=>{ if(!api.hasStoredToken()){setRestoring(false);return;} api.me().then(setAccount).catch(()=>api.setToken(null)).finally(()=>setRestoring(false)); },[]);
  if(restoring) return <main className="auth-shell"><p>Lade Nexus-Sitzung...</p></main>;
  if(!account) return <main className="auth-shell"><AuthPage onAuthenticated={(a)=>{setAccount(a);setStep({name:"select"});}} /></main>;
  const logout=()=>{ api.logout().catch(()=>undefined); api.setToken(null); setAccount(null); setStep({name:"select"}); };
  return <div className="app-root">
    {step.name==="select"&&<CharacterSelect account={account} onSelect={c=>setStep({name:"game",character:c})} onCreate={()=>setStep({name:"home"})} onLogout={logout} />}
    {step.name==="home"&&<Home onStart={()=>setStep({name:"world"})} />}
    {step.name==="world"&&<WorldSelect onSelect={world=>setStep({name:"create",world})} />}
    {step.name==="create"&&<CharacterCreate account={account} world={step.world} onBack={()=>setStep({name:"world"})} onCreated={character=>setStep({name:"game",character})} />}
    {step.name==="game"&&<Game character={step.character} onExit={()=>setStep({name:"select"})}/>}
  </div>;
}
