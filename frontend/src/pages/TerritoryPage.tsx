import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Notice, Panel, buttonRowStyle } from "../components/Panel";
import type { Character, RegionEntry } from "../types/models";

export function TerritoryPage({ character }: { character: Character }) {
  const [regions,setRegions]=useState<RegionEntry[]>([]); const [error,setError]=useState<string|null>(null); const [message,setMessage]=useState<string|null>(null);
  async function refresh(){try{setRegions(await api.getRegions(character.worldId));}catch(e){setError(e instanceof Error?e.message:"Gebiete konnten nicht geladen werden");}}
  useEffect(()=>{void refresh();},[character.worldId]);
  async function act(fn:()=>Promise<unknown>,msg:string){setError(null);setMessage(null);try{await fn();setMessage(msg);await refresh();}catch(e){setError(e instanceof Error?e.message:"Aktion fehlgeschlagen");}}
  return <section><h2>Gebiete & Herrschaft</h2><p>Die Kriegsregeln sind noch nicht final; die vorhandene flexible Claim-/Belagerungs-/Verteidigungsgrundlage bleibt erhalten.</p>{message&&<Notice>{message}</Notice>}{error&&<Notice error>{error}</Notice>}
    {regions.length===0?<p>In dieser Welt gibt es aktuell keine technisch kontrollierbaren Gebiete.</p>:regions.map(({location,control})=><Panel key={location.id} title={location.name}>
      <p>{location.description}</p><p>Herrscher: <strong>{control.rulerCharacterId ?? "unbeansprucht"}</strong> · anwesend: {control.rulerPresent?"ja":"nein"} · Belagerung: {control.siegeProgress}%</p><p>Verteidiger: {control.defenderCharacterIds.length}</p>
      <div style={buttonRowStyle}>{!control.rulerCharacterId&&<button onClick={()=>act(()=>api.claimRegion(location.id,character.id),"Gebiet beansprucht.")}>Beanspruchen</button>}{control.rulerCharacterId===character.id&&<><button onClick={()=>act(()=>api.setRegionPresence(location.id,character.id,!control.rulerPresent),"Anwesenheit geändert.")}>{control.rulerPresent?"Gebiet verlassen":"Anwesend melden"}</button></>}{control.rulerCharacterId&&control.rulerCharacterId!==character.id&&<><button onClick={()=>act(()=>api.joinRegionDefense(location.id,character.id),"Verteidigung beigetreten.")}>Verteidigen</button><button onClick={()=>act(()=>api.attackRegion(location.id,character.id),"Angriff ausgeführt.")}>Angreifen</button>{control.defenderCharacterIds.includes(character.id)&&<button onClick={()=>act(()=>api.rebelRegion(location.id,character.id),"Rebellion ausgeführt.")}>Rebellieren</button>}</>}</div>
      {control.eventLog.length>0&&<details style={{marginTop:10}}><summary>Ereignislog</summary><ul>{control.eventLog.slice().reverse().map((e,i)=><li key={i}>{e.message}</li>)}</ul></details>}
    </Panel>)}
  </section>;
}
