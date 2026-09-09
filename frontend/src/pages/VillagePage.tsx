import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Notice, Panel, buttonRowStyle } from "../components/Panel";
import type { Character, Village, VillageRank } from "../types/models";
const ranks:VillageRank[]=["Genin","Chūnin","Jōnin","Kage"];
export function VillagePage({character,onUpdated}:{character:Character;onUpdated:(c:Character)=>void}){
 const [villages,setVillages]=useState<Village[]>([]);const [error,setError]=useState<string|null>(null);const [message,setMessage]=useState<string|null>(null);
 async function refresh(){try{setVillages(await api.getVillages()); const c=await api.getCharacter(character.id);onUpdated(c);}catch(e){setError(e instanceof Error?e.message:"Dörfer konnten nicht geladen werden");}}
 useEffect(()=>{void refresh();},[]);
 async function join(id:string){try{await api.joinVillage(id,character.id);setMessage("Dorf beigetreten.");await refresh();}catch(e){setError(e instanceof Error?e.message:"Beitritt fehlgeschlagen");}}
 async function promote(id:string,rank:VillageRank){try{await api.promoteVillageMember(id,character.id,character.id,rank);setMessage(`Rang auf ${rank} geändert.`);await refresh();}catch(e){setError(e instanceof Error?e.message:"Beförderung fehlgeschlagen");}}
 const own=villages.find(v=>v.members.some(m=>m.characterId===character.id));
 return <section><h2>Ninja-Dorf</h2>{message&&<Notice>{message}</Notice>}{error&&<Notice error>{error}</Notice>}{own?<Panel title={own.name}><p>Dein Rang: <strong>{own.members.find(m=>m.characterId===character.id)?.rank}</strong> · Kage-Titel: {own.kageTitle}</p><div style={buttonRowStyle}>{ranks.map(r=><button key={r} onClick={()=>promote(own.id,r)}>Beförderung: {r}</button>)}</div><p><small>Die Route erzwingt bereits die Rangregeln; ungültige Selbstbeförderungen werden serverseitig abgelehnt.</small></p></Panel>:<>{villages.map(v=><Panel key={v.id} title={v.name}><p>Kage-Titel: {v.kageTitle} · Mitglieder: {v.members.length}</p><button onClick={()=>join(v.id)}>Dorf beitreten</button></Panel>)}</>}
 </section>;
}
