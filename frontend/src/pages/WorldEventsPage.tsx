import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Notice, Panel, buttonRowStyle } from "../components/Panel";
import type { ActiveWorldEncounter, Character, LegendaryEntity, WorldCrystal, WorldEncounterDefinition } from "../types/models";

const entityName = (e: LegendaryEntity) => String(e.name ?? e.id);

export function WorldEventsPage({ character, onUpdated }: { character: Character; onUpdated: (c: Character) => void }) {
  const [defs,setDefs]=useState<WorldEncounterDefinition[]>([]); const [active,setActive]=useState<ActiveWorldEncounter[]>([]); const [entities,setEntities]=useState<LegendaryEntity[]>([]); const [crystals,setCrystals]=useState<WorldCrystal[]>([]);
  const [message,setMessage]=useState<string|null>(null); const [error,setError]=useState<string|null>(null);
  async function refresh(){ try { const [d,a,c]=await Promise.all([api.getEncounterDefinitions(character.worldId),api.getActiveEncounters(character.worldId),api.getWorldCrystals()]); setDefs(d);setActive(a);setCrystals(c); let list:LegendaryEntity[]=[]; if(character.worldId==="avalon") list=await api.listAvailableEspers() as LegendaryEntity[]; if(character.worldId==="ninja_welt") list=[...(await api.listAvailableBijuu() as LegendaryEntity[]),...(await api.listAvailableOtsutsuki() as LegendaryEntity[])]; setEntities(list); } catch(e){setError(e instanceof Error?e.message:"Weltereignisse konnten nicht geladen werden");} }
  useEffect(()=>{ void refresh(); },[character.worldId]);
  const activeDefIds=new Set(active.map(a=>a.definitionId));
  async function devSpawn(id:string){setError(null);try{await api.activateEncounter(id);setMessage("Weltereignis für den aktuellen Entwicklungsstand aktiviert.");await refresh();}catch(e){setError(e instanceof Error?e.message:"Aktivierung fehlgeschlagen");}}
  async function interact(entity:LegendaryEntity){setError(null);setMessage(null);try{let updated:Character;if(character.worldId==="avalon") updated=await api.attemptEsperPact(character.id,entity.id);else if(String(entity.id).startsWith("bijuu-")) updated=await api.fightAndSealBijuu(character.id,entity.id);else updated=await api.fightOtsutsuki(character.id,entity.id);onUpdated(updated);setMessage(`Begegnung mit ${entityName(entity)} abgeschlossen.`);await refresh();}catch(e){setError(e instanceof Error?e.message:"Begegnung fehlgeschlagen");}}
  async function stabilize(id:string){setError(null);try{await api.stabilizeCrystal(id,character.id);setMessage("Kristall stabilisiert.");await refresh();}catch(e){setError(e instanceof Error?e.message:"Kristallaktion fehlgeschlagen");}}
  return <section><h2>Weltereignisse</h2><p>Legendäre Wesen erscheinen als dynamische Begegnungen und sind nicht dauerhaft verfügbar.</p>{message&&<Notice>{message}</Notice>}{error&&<Notice error>{error}</Notice>}
    <Panel title="Aktive Begegnungen">{active.length===0?<p>Aktuell ist kein legendäres Weltereignis aktiv.</p>:active.map(a=>{const d=defs.find(x=>x.id===a.definitionId);return <div key={a.definitionId} style={{marginBottom:10}}><strong>{d?.entityType ?? "Encounter"}: {d?.entityId ?? a.definitionId}</strong><br/><small>Ort: {a.activeLocationId} · seit {new Date(a.spawnedAt).toLocaleString()}</small></div>})}</Panel>
    {entities.length>0&&<Panel title="Begegnungen am aktuellen Spawn">{entities.map(e=><div key={e.id} style={{borderTop:"1px solid #eee",paddingTop:10,marginTop:10}}><strong>{entityName(e)}</strong>{e.description&&<p>{e.description}</p>}<button onClick={()=>interact(e)}>{character.worldId==="avalon"?"Pakt versuchen":String(e.id).startsWith("bijuu-")?"Bekämpfen & versiegeln":"Begegnung bestreiten"}</button></div>)}</Panel>}
    <Panel title="Encounter-Katalog" muted>{defs.map(d=><div key={d.id} style={{marginBottom:12}}><strong>{d.entityType}: {d.entityId}</strong> · {d.rarity}<br/><small>Spawnchance: {d.spawnChance ?? "noch nicht gebalanced"} · Ownership: {d.uniqueOwnershipRule}</small>{!activeDefIds.has(d.id)&&<div style={buttonRowStyle}><button onClick={()=>devSpawn(d.id)}>Entwicklungs-Spawn auslösen</button></div>}</div>)}<Notice>Die Spawn-Schaltfläche ist vorerst eine Entwicklungssteuerung, solange automatische Spawnwahrscheinlichkeiten bewusst noch offen sind.</Notice></Panel>
    <Panel title="Weltenkristalle">{crystals.filter(c=>c.worldId===character.worldId).map(c=><div key={c.id}><strong>{c.name}</strong><p>Stabilität: {c.stability}% · Verbindungen: {c.connectedCrystalIds.join(", ")}</p><button onClick={()=>stabilize(c.id)}>Kristall stabilisieren</button></div>)}</Panel>
  </section>;
}
