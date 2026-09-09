import type { ReactNode } from "react";
export function Panel({title,children,muted}:{title:string;children:ReactNode;muted?:boolean}){return <section className={`panel ${muted?"panel-muted":""}`}><div className="panel-heading"><h3>{title}</h3></div><div className="panel-body">{children}</div></section>}
export function Notice({children,error}:{children:ReactNode;error?:boolean}){return <div className={`notice ${error?"notice-error":""}`}>{children}</div>}
export const buttonRowStyle={display:"flex",gap:8,flexWrap:"wrap" as const,marginTop:10};
