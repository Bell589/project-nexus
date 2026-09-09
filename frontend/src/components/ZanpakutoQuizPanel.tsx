import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Character, QuizQuestion, UniquePowerInstance } from "../types/models";
export function ZanpakutoQuizPanel({character,onUpdated}:{character:Character;onUpdated:(c:Character)=>void}){
 const [questions,setQuestions]=useState<QuizQuestion[]>([]);const [answers,setAnswers]=useState<number[]>([]);const [found,setFound]=useState<UniquePowerInstance|null>(null);const [error,setError]=useState<string|null>(null);
 useEffect(()=>{api.getZanpakutoQuiz().then(q=>{setQuestions(q);setAnswers(q.map(()=>-1));}).catch(()=>setQuestions([]));},[]);
 async function evaluate(){try{setFound(await api.zanpakutoQuiz(character.id,answers));setError(null);}catch(e){setError(e instanceof Error?e.message:"Quiz konnte nicht ausgewertet werden");}}
 async function bind(){if(!found)return;try{onUpdated(await api.acquireCorePower(character.id,found));setFound(null);}catch(e){setError(e instanceof Error?e.message:"Zanpakutō konnte nicht gebunden werden");}}
 if(character.uniquePower||character.worldId!=="soul_society"||character.factionId!=="shinigami")return null;
 return <div style={{border:"1px solid #ddd",borderRadius:8,padding:16,marginTop:16}}><h3 style={{marginTop:0}}>Zanpakutō-Resonanzquiz</h3><p>Optionaler datengetriebener Weg, um die individuelle Ausprägung an deinen Kampfstil anzulehnen.</p>{questions.map((q,i)=><label key={q.id} style={{display:"grid",gap:4,marginBottom:10}}><strong>{q.question}</strong><select value={answers[i]??-1} onChange={e=>setAnswers(a=>a.map((v,x)=>x===i?Number(e.target.value):v))}><option value={-1}>Antwort wählen...</option>{q.options.map((o,j)=><option key={j} value={j}>{o.label}</option>)}</select></label>)}{error&&<p style={{color:"crimson"}}>{error}</p>}{!found?<button disabled={answers.some(a=>a<0)} onClick={evaluate}>Resonanz auswerten</button>:<div><p>Gefundene Resonanz: <strong>{found.generatedName}</strong> · {found.variant}</p><button onClick={bind}>Zanpakutō binden</button></div>}</div>;
}
