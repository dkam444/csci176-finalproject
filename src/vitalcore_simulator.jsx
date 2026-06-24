import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, ReferenceLine, Cell
} from "recharts";
import { Amplify } from "aws-amplify";
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp, confirmSignIn } from "aws-amplify/auth";

Amplify.configure({
  Auth: {
    Cognito: {
      region: "us-east-2",
      userPoolId: "us-east-2_ohVJORU4Z",
      userPoolClientId: "3ftoram6oq0ri1klm4no0bf910",
      loginWith: { email: true },
    },
  },
});

const C = {
  bg:"#F5F7FA", surface:"#FFFFFF", surfaceAlt:"#F0F4F8",
  border:"#DDE3ED", navy:"#1A2B4A", navyMid:"#2C3E60",
  accent:"#2563EB", accentSoft:"#EBF1FF",
  teal:"#0891B2", tealSoft:"#E0F7FA",
  green:"#059669", greenSoft:"#ECFDF5",
  amber:"#D97706", amberSoft:"#FFFBEB",
  red:"#DC2626", slate:"#64748B", slateLight:"#94A3B8",
  text:"#1E293B", textMid:"#475569", white:"#FFFFFF",
  shadow:"0 1px 3px rgba(0,0,0,0.08)",
  shadowMd:"0 4px 6px rgba(0,0,0,0.07)",
};

const NAV = [
  { label:"Executive Summary", icon:"🏛", subTabs:["Overview"] },
  { label:"Financial", icon:"💰", subTabs:["Executive Financial Dashboard","Value Realization"] },
  { label:"Governance", icon:"🛡", subTabs:["Cloud Governance","Decision Rights"] },
  { label:"Operations", icon:"⚙️", subTabs:["DevOps & Implementation","Resilience & Availability"] },
  { label:"Innovation", icon:"🤖", subTabs:["AI Investment Explorer"] },
  { label:"Adoption", icon:"📈", subTabs:["Org Adoption","Market Diffusion"] },
  { label:"Cost Management", icon:"☁️", subTabs:["Cloud Cost Management"], badge:"EC" },
  { label:"About & Deployment", icon:"🚀", subTabs:["AWS Deployment Info"], badge:"EC2" },
];

const TT = { background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, boxShadow:C.shadowMd, color:C.text, fontSize:12 };
const TICK = { fill:C.slateLight, fontSize:11 };
const GRID = { stroke:C.border, strokeDasharray:"3 3" };

function Card({ children, style }) {
  return (
    <div style={{ background:C.surface, borderRadius:12, padding:"18px 22px", border:`1px solid ${C.border}`, boxShadow:C.shadow, ...style }}>
      {children}
    </div>
  );
}

function KPI({ label, value, sub, color }) {
  const c = color || C.accent;
  return (
    <div style={{ background:C.surface, borderRadius:10, padding:"14px 18px", borderLeft:`4px solid ${c}`, flex:1, minWidth:130, boxShadow:C.shadow, border:`1px solid ${C.border}`, borderLeftColor:c }}>
      <div style={{ color:C.slateLight, fontSize:10, textTransform:"uppercase", letterSpacing:1, fontWeight:600 }}>{label}</div>
      <div style={{ color:c, fontSize:24, fontWeight:700, margin:"4px 0 2px" }}>{value}</div>
      {sub && <div style={{ color:C.slateLight, fontSize:11 }}>{sub}</div>}
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange, format }) {
  const fmt = format || (v => v);
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ color:C.textMid, fontSize:12, fontWeight:500 }}>{label}</span>
        <span style={{ color:C.accent, fontSize:12, fontWeight:700 }}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step || 0.01} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width:"100%", accentColor:C.accent }} />
    </div>
  );
}

function ST({ children }) {
  return (
    <div style={{ color:C.accent, fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:3, height:12, background:C.accent, borderRadius:2 }} />
      {children}
    </div>
  );
}

function Insight({ text }) {
  return (
    <div style={{ marginTop:14 }}>
      <div style={{ color:C.accent, fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:6, display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:3, height:12, background:C.accent, borderRadius:2 }} />
        Executive Recommendations
      </div>
      <div style={{ background:C.accentSoft, border:`1px solid #BFDBFE`, borderRadius:10, padding:"12px 16px", color:C.navyMid, fontSize:13, lineHeight:1.6, display:"flex", gap:10 }}>
        <span>💡</span><span>{text}</span>
      </div>
    </div>
  );
}

function PH({ title, subtitle }) {
  return (
    <div style={{ marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
      <h2 style={{ color:C.navy, fontSize:18, fontWeight:700, margin:"0 0 4px" }}>{title}</h2>
      {subtitle && <p style={{ color:C.slate, fontSize:13, margin:0 }}>{subtitle}</p>}
    </div>
  );
}

function SubTabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
      {tabs.map((t, i) => (
        <button key={i} onClick={() => onChange(i)} style={{
          padding:"7px 16px", borderRadius:20,
          border:`1px solid ${active === i ? C.accent : C.border}`,
          background: active === i ? C.accent : C.surface,
          color: active === i ? C.white : C.textMid,
          fontSize:12, fontWeight:600, cursor:"pointer"
        }}>{t}</button>
      ))}
    </div>
  );
}

// ── Executive Summary ──────────────────────────────────────────────────────────
function ExecutiveSummary() {
  return (
    <div>
      <PH title="VitalCore Health — AWS Cloud Migration" subtitle="Executive Board Briefing · June 2026" />

      <Card style={{ background:C.navy, border:"none", marginBottom:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
          <div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:10, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Purpose</div>
            <div style={{ color:C.white, fontSize:15, lineHeight:1.7 }}>
              Modernize VitalCore's aging on-premise infrastructure across 8 hospitals by migrating to AWS —
              enabling real-time patient analytics, HIPAA compliance automation, and enterprise-grade uptime for critical clinical systems.
            </div>
          </div>
          <div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:10, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Stakeholders</div>
            {["CIO — Migration sponsor & architecture","CFO — Budget & ROI oversight","Compliance Officer — HIPAA & SOC 2","Data Scientists — Analytics platform","Operations Team — Uptime & SLAs","Clinical Staff — End-user adoption"].map((s, i) => (
              <div key={i} style={{ color:C.white, fontSize:14, marginBottom:6, display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"#60A5FA", flexShrink:0 }} />
                {s}
              </div>
            ))}
          </div>
          <div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:10, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Measurable Outcomes</div>
            {[["99.9%","Uptime SLA"],["30%","Cost Reduction"],["95%+","HIPAA Audit Score"],["75%","Latency Reduction"],["80%","Staff Adoption (6mo)"],["Year 3","Positive ROI Target"]].map(([v,l], i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:5, paddingBottom:5, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ color:"#93C5FD", fontWeight:700, fontSize:15 }}>{v}</span>
                <span style={{ color:"rgba(255,255,255,0.6)", fontSize:13 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20 }}>
        <KPI label="5-Year NPV" value="$284K" color={C.green} sub="At 30% cloud savings" />
        <KPI label="Payback Period" value="2.5 yrs" color={C.accent} />
        <KPI label="HIPAA Score" value="87%" color={C.amber} sub="Target: 95%" />
        <KPI label="DORA Level" value="High" color={C.teal} sub="65% automation" />
        <KPI label="Uptime" value="99.9%" color={C.green} sub="Redundancy L3" />
        <KPI label="Peak Adoption" value="76%" color={C.accent} sub="24-month projection" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <ST>Panel Status Overview</ST>
          {[
            { label:"Financial ROI", status:"On Track", color:C.green, note:"NPV positive, payback Yr 3" },
            { label:"Value Realization", status:"On Track", color:C.green, note:"$890K+ total value" },
            { label:"HIPAA Governance", status:"Attention", color:C.amber, note:"Score 87% — target 95%" },
            { label:"Decision Rights", status:"On Track", color:C.green, note:"SLA framework defined" },
            { label:"DevOps / DORA", status:"On Track", color:C.teal, note:"High performance tier" },
            { label:"Resilience & HA", status:"On Track", color:C.green, note:"99.9% uptime achieved" },
            { label:"AI Investment", status:"On Track", color:C.green, note:"ROI peaks at $300K" },
            { label:"Org Adoption", status:"Attention", color:C.amber, note:"Leadership engagement needed" },
            { label:"Market Diffusion", status:"On Track", color:C.green, note:"LTV:CAC 5.6x — healthy" },
            { label:"Cloud Cost Mgmt", status:"Demo Mode", color:C.teal, note:"Connect AWS for live data" },
          ].map((r, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.text, fontSize:14 }}>{r.label}</span>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ color:C.slate, fontSize:12 }}>{r.note}</span>
                <span style={{ background:r.color === C.green ? C.greenSoft : r.color === C.amber ? C.amberSoft : C.tealSoft, color:r.color, fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{r.status}</span>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <ST>Board-Level Narrative & Recommended Actions</ST>
          <p style={{ color:C.textMid, fontSize:15, lineHeight:1.7 }}>
            VitalCore's AWS migration presents a compelling strategic case. The simulation confirms a positive 5-year NPV
            with payback by Year 3, driven primarily by downtime reduction and compliance savings across 8 hospital facilities.
            HIPAA compliance at 87% requires immediate remediation before go-live to meet the 95% audit threshold.
          </p>
          <p style={{ color:C.textMid, fontSize:15, lineHeight:1.7 }}>
            DevOps performance is at the High DORA tier — increasing automation above 70% will unlock Elite performance
            and reduce change failure rate by an estimated 40%. Organizational adoption projections show 76% peak adoption,
            contingent on 30+ training hours and 70%+ leadership engagement.
          </p>
          <ST>Top 3 Recommended Actions</ST>
          {[
            { n:"1", action:"Remediate HIPAA compliance gaps", detail:"Prioritize IAM policy audits and incident response to reach 95% audit score before go-live.", color:C.red },
            { n:"2", action:"Push automation above 70%", detail:"Crossing the 70% automation threshold unlocks Elite DORA performance and reduces deployment failures by 40%.", color:C.amber },
            { n:"3", action:"Invest in leadership engagement", detail:"Leadership engagement is the top adoption risk. A structured change-management program drives 80% adoption within 6 months.", color:C.accent },
          ].map(r => (
            <div key={r.n} style={{ display:"flex", gap:12, marginBottom:12, padding:"10px 14px", background:C.surfaceAlt, borderRadius:8, border:`1px solid ${C.border}` }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:r.color, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{r.n}</div>
              <div>
                <div style={{ color:C.text, fontSize:15, fontWeight:600 }}>{r.action}</div>
                <div style={{ color:C.slate, fontSize:13, marginTop:3 }}>{r.detail}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── Financial Dashboard ────────────────────────────────────────────────────────
function FinancialDashboard() {
  const [capex, setCapex] = useState(1200000);
  const [opex, setOpex] = useState(216000);
  const [growth, setGrowth] = useState(8);
  const [discount, setDiscount] = useState(8);
  const [savings, setSavings] = useState(30);

  const sr = savings/100, dr = discount/100, gr = growth/100;
  const cf = [1,2,3,4,5].map(yr => {
    const ann = opex * sr * Math.pow(1+gr, yr-1);
    const net = ann - opex * (1-sr) * Math.pow(1+gr, yr-1);
    const pv = net / Math.pow(1+dr, yr);
    return { year:`Y${yr}`, capex: yr===1?capex:0, opex:Math.round(opex*Math.pow(1+gr,yr-1)), savings:Math.round(ann), net:Math.round(net), pv:Math.round(pv) };
  });
  const npv = cf.reduce((s,r) => s+r.pv, 0) - capex;
  const roi = ((cf.reduce((s,r) => s+r.net, 0) - capex) / capex) * 100;
  const payback = capex / (cf[0].savings || 1);
  const tco5 = cf.reduce((s,r) => s+r.opex, 0) + capex;
  let cum = 0;
  const cumData = cf.map(r => { cum += r.net - (r.capex||0); return { year:r.year, cumROI:Math.round(cum/1000) }; });

  return (
    <div>
      <PH title="Executive Financial Dashboard" subtitle="5-year TCO, NPV, ROI, and cash flow analysis" />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="Year-1 CapEx" value={`$${(capex/1e6).toFixed(1)}M`} color={C.amber} />
        <KPI label="Annual OpEx" value={`$${(opex/1e3).toFixed(0)}K`} color={C.accent} />
        <KPI label="5-Year TCO" value={`$${(tco5/1e6).toFixed(2)}M`} color={C.red} />
        <KPI label="NPV" value={`$${(npv/1e3).toFixed(0)}K`} color={npv>0?C.green:C.red} />
        <KPI label="5-Yr ROI" value={`${roi.toFixed(1)}%`} color={roi>0?C.green:C.red} />
        <KPI label="Payback" value={`${payback.toFixed(1)} yrs`} color={C.teal} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <Card>
          <ST>Model Inputs</ST>
          <Slider label="Initial CapEx ($)" min={200000} max={5000000} step={50000} value={capex} onChange={setCapex} format={v=>`$${(v/1e3).toFixed(0)}K`} />
          <Slider label="Annual OpEx ($)" min={50000} max={1000000} step={10000} value={opex} onChange={setOpex} format={v=>`$${(v/1e3).toFixed(0)}K`} />
          <Slider label="Revenue Growth %" min={0} max={30} step={0.5} value={growth} onChange={setGrowth} format={v=>`${v}%`} />
          <Slider label="Discount Rate %" min={3} max={20} step={0.5} value={discount} onChange={setDiscount} format={v=>`${v}%`} />
          <Slider label="Cloud Savings %" min={5} max={60} step={1} value={savings} onChange={setSavings} format={v=>`${v}%`} />
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <ST>Cumulative ROI Curve ($K)</ST>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={cumData}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tick={TICK} />
                <Tooltip contentStyle={TT} />
                <ReferenceLine y={0} stroke={C.red} strokeDasharray="4 4" />
                <Area type="monotone" dataKey="cumROI" stroke={C.accent} fill={C.accentSoft} strokeWidth={2} name="Cumulative ROI ($K)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ST>CapEx vs OpEx vs Savings</ST>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={cf}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tick={TICK} tickFormatter={v=>`${(v/1e3).toFixed(0)}K`} />
                <Tooltip contentStyle={TT} formatter={v=>`$${(v/1e3).toFixed(0)}K`} />
                <Legend wrapperStyle={{ color:C.slate, fontSize:11 }} />
                <Bar dataKey="capex" name="CapEx" fill={C.amber} stackId="a" />
                <Bar dataKey="opex" name="OpEx" fill="#93C5FD" stackId="a" />
                <Bar dataKey="savings" name="Savings" fill={C.green} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <Card style={{ marginTop:14 }}>
        <ST>5-Year Cash Flow Table</ST>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:C.surfaceAlt }}>
                {["", "Year 1","Year 2","Year 3","Year 4","Year 5"].map(h => (
                  <th key={h} style={{ padding:"8px 12px", textAlign:"right", color:C.slate, fontWeight:600, borderBottom:`1px solid ${C.border}`, textAlign: h===""?"left":"right" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label:"Capital", values: cf.map(r => r.capex > 0 ? -r.capex : 0), color: C.amber },
                { label:"Revenue", values: cf.map(r => Math.round(r.opex * (1 + savings/100))), color: C.green },
                { label:"Expense", values: cf.map(r => -r.opex), color: C.red },
                { label:"Net Profit", values: cf.map(r => r.net), color: C.accent },
                { label:"Cumulative Cash", values: cf.map((_, i) => cumData[i].cumROI * 1000), color: C.teal },
              ].map((row, ri) => {
                return (
                  <tr key={row.label} style={{ background: ri % 2 === 0 ? C.surface : C.surfaceAlt }}>
                    <td style={{ padding:"8px 12px", color:C.textMid, fontWeight:600, borderBottom:`1px solid ${C.border}` }}>{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} style={{ padding:"8px 12px", textAlign:"right", color: v >= 0 ? C.green : C.red, fontWeight:500, borderBottom:`1px solid ${C.border}` }}>
                        {v >= 0 ? "+" : ""}${(v/1e3).toFixed(0)}K
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Insight text={`VitalCore's AWS migration requires $${(capex/1e3).toFixed(0)}K upfront. At ${savings}% cloud savings, payback is ${payback.toFixed(1)} years with a 5-year NPV of $${(npv/1e3).toFixed(0)}K — ${npv>0?"a compelling investment case":"requiring cost optimization to justify"}.`} />
    </div>
  );
}

// ── Value Realization ─────────────────────────────────────────────────────────
function ValueRealization() {
  const [productivity, setProductivity] = useState(25);
  const [downtime, setDowntime] = useState(40);
  const [compliance, setCompliance] = useState(150000);
  const [csat, setCsat] = useState(20);

  const pv = 4000*12*(productivity/100)*0.3;
  const dv = 500000*(downtime/100);
  const cv = 2000000*(csat/100)*0.05;
  const total = pv + dv + compliance + cv;

  const waterfall = [
    { name:"Productivity", value:Math.round(pv/1e3), fill:C.accent },
    { name:"Downtime", value:Math.round(dv/1e3), fill:C.teal },
    { name:"Compliance", value:Math.round(compliance/1e3), fill:C.green },
    { name:"CSAT", value:Math.round(cv/1e3), fill:C.amber },
    { name:"Total", value:Math.round(total/1e3), fill:C.navy },
  ];
  const roiTrend = [1,2,3,4,5].map(yr => ({
    year:`Y${yr}`,
    realized: Math.round((total/1e3)*(yr*0.18+0.1)),
    target: Math.round((total/1e3)*yr*0.22),
  }));

  return (
    <div>
      <PH title="Value Realization Dashboard" subtitle="Tangible and intangible benefit analysis" />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="Productivity Gain" value={`$${(pv/1e3).toFixed(0)}K`} color={C.accent} />
        <KPI label="Downtime Savings" value={`$${(dv/1e3).toFixed(0)}K`} color={C.teal} />
        <KPI label="Compliance Savings" value={`$${(compliance/1e3).toFixed(0)}K`} color={C.green} />
        <KPI label="CSAT Revenue" value={`$${(cv/1e3).toFixed(0)}K`} color={C.amber} />
        <KPI label="Total Value" value={`$${(total/1e3).toFixed(0)}K`} color={C.navy} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <Card>
          <ST>Value Assumptions</ST>
          <Slider label="Productivity Gain %" min={0} max={60} step={1} value={productivity} onChange={setProductivity} format={v=>`${v}%`} />
          <Slider label="Downtime Reduction %" min={0} max={80} step={1} value={downtime} onChange={setDowntime} format={v=>`${v}%`} />
          <Slider label="Compliance Savings ($)" min={0} max={500000} step={10000} value={compliance} onChange={setCompliance} format={v=>`$${(v/1e3).toFixed(0)}K`} />
          <Slider label="CSAT Improvement %" min={0} max={50} step={1} value={csat} onChange={setCsat} format={v=>`${v}%`} />
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <ST>Value Sources — Waterfall ($K)</ST>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={waterfall}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="name" tick={TICK} />
                <YAxis tick={TICK} />
                <Tooltip contentStyle={TT} formatter={v=>`$${v}K`} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {waterfall.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ST>ROI Realization vs Target ($K)</ST>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={roiTrend}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tick={TICK} />
                <Tooltip contentStyle={TT} formatter={v=>`$${v}K`} />
                <Legend wrapperStyle={{ color:C.slate, fontSize:11 }} />
                <Line type="monotone" dataKey="realized" stroke={C.accent} strokeWidth={2} name="Realized" dot={{ r:3 }} />
                <Line type="monotone" dataKey="target" stroke={C.amber} strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Benefit Breakdown Table + Color-coded Zones */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:14 }}>
        <Card>
          <ST>Benefit Breakdown Table</ST>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:C.surfaceAlt }}>
                {["Benefit","Annual Value","5-Year Value","Type"].map(h => (
                  <th key={h} style={{ padding:"7px 10px", textAlign:"left", color:C.slate, fontWeight:600, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { benefit:"Productivity Gains", annual: Math.round(pv/1e3), type:"Tangible", color:C.accent },
                { benefit:"Downtime Reduction", annual: Math.round(dv/1e3), type:"Tangible", color:C.teal },
                { benefit:"Compliance Savings", annual: Math.round(compliance/1e3), type:"Tangible", color:C.green },
                { benefit:"CSAT Revenue", annual: Math.round(cv/1e3), type:"Intangible", color:C.amber },
              ].map((r, i) => (
                <tr key={r.benefit} style={{ background: i%2===0?C.surface:C.surfaceAlt }}>
                  <td style={{ padding:"7px 10px", color:C.textMid, borderBottom:`1px solid ${C.border}` }}>{r.benefit}</td>
                  <td style={{ padding:"7px 10px", color:r.color, fontWeight:600, borderBottom:`1px solid ${C.border}` }}>${r.annual}K</td>
                  <td style={{ padding:"7px 10px", color:r.color, fontWeight:600, borderBottom:`1px solid ${C.border}` }}>${r.annual*5}K</td>
                  <td style={{ padding:"7px 10px", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ background:r.type==="Tangible"?C.accentSoft:C.amberSoft, color:r.type==="Tangible"?C.accent:C.amber, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{r.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <ST>Return Scenario Zones</ST>
          {[
            { label:"🔴 Under-performing", range:`< $${Math.round(total*0.7/1e3)}K`, desc:"Below 70% of target value", bg:C.redSoft, color:C.red },
            { label:"🟡 Expected Return", range:`$${Math.round(total*0.7/1e3)}K – $${Math.round(total*1.2/1e3)}K`, desc:"70–120% of target value", bg:C.amberSoft, color:C.amber },
            { label:"🟢 High Return", range:`> $${Math.round(total*1.2/1e3)}K`, desc:"Above 120% of target value", bg:C.greenSoft, color:C.green },
          ].map(z => (
            <div key={z.label} style={{ background:z.bg, borderRadius:8, padding:"10px 14px", marginBottom:10, border:`1px solid ${z.color}30` }}>
              <div style={{ color:z.color, fontSize:12, fontWeight:700 }}>{z.label}</div>
              <div style={{ color:z.color, fontSize:13, fontWeight:600 }}>{z.range}</div>
              <div style={{ color:C.slate, fontSize:11 }}>{z.desc}</div>
            </div>
          ))}
          <div style={{ marginTop:8, padding:"8px 12px", background: total > total*1.2 ? C.greenSoft : total > total*0.7 ? C.amberSoft : C.redSoft, borderRadius:8 }}>
            <span style={{ fontSize:12, fontWeight:700, color: total > total*1.2 ? C.green : total > total*0.7 ? C.amber : C.red }}>
              Current: {total > total*1.2 ? "🟢 High Return" : total > total*0.7 ? "🟡 Expected Return" : "🔴 Under-performing"} — ${Math.round(total/1e3)}K total value
            </span>
          </div>
        </Card>
      </div>

      <Insight text={`VitalCore's migration generates $${(total/1e3).toFixed(0)}K in total value. The largest driver is ${dv>pv?"downtime reduction":"productivity gains"}, reflecting critical hospital uptime requirements.`} />
    </div>
  );
}

// ── Cloud Governance ──────────────────────────────────────────────────────────
function CloudGovernance() {
  const [cs, setCs] = useState(87);
  const [pe, setPe] = useState(3);
  const [af, setAf] = useState(2);
  const [rl, setRl] = useState(25);

  const maturity = Math.round((cs*0.5) + ((100-rl)*0.3) + ((10-Math.min(pe+af,10))*2));
  const radarData = [
    { subject:"IAM", A:88 }, { subject:"Encryption", A:95 }, { subject:"Network", A:78 },
    { subject:"Logging", A:82 }, { subject:"Incident Resp", A:70 }, { subject:"HIPAA", A:cs },
  ];

  return (
    <div>
      <PH title="Cloud Governance Dashboard" subtitle="Board-level governance structure, compliance KPIs, and security controls" />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="Compliance Score" value={`${cs}%`} color={cs>80?C.green:C.amber} />
        <KPI label="Policy Exceptions" value={pe} color={pe<5?C.green:C.red} />
        <KPI label="Audit Findings" value={af} color={af<3?C.green:C.red} />
        <KPI label="Risk Level" value={`${rl}%`} color={rl<30?C.green:C.red} />
        <KPI label="Gov. Maturity" value={`${maturity}%`} color={maturity>75?C.green:C.amber} sub="Composite" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <Card>
          <ST>Governance KPI Inputs</ST>
          <Slider label="Compliance Score %" min={40} max={100} step={1} value={cs} onChange={setCs} format={v=>`${v}%`} />
          <Slider label="Policy Exceptions" min={0} max={20} step={1} value={pe} onChange={setPe} format={v=>v} />
          <Slider label="Audit Findings" min={0} max={15} step={1} value={af} onChange={setAf} format={v=>v} />
          <Slider label="Risk Level %" min={0} max={100} step={1} value={rl} onChange={setRl} format={v=>`${v}%`} />
          <div style={{ marginTop:14, padding:"10px 14px", background:C.surfaceAlt, borderRadius:8, border:`1px solid ${C.border}` }}>
            <div style={{ color:C.slate, fontSize:11, marginBottom:4 }}>Governance Maturity</div>
            <div style={{ background:C.border, borderRadius:4, height:8 }}>
              <div style={{ width:`${maturity}%`, background:maturity>75?C.green:C.amber, borderRadius:4, height:"100%", transition:"width 0.3s" }} />
            </div>
            <div style={{ color:C.text, fontSize:12, marginTop:4, fontWeight:600 }}>{maturity}% — {maturity>80?"Optimized":maturity>65?"Managed":"Developing"}</div>
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <ST>Security Controls Radar</ST>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="subject" tick={TICK} />
                <PolarRadiusAxis angle={90} domain={[0,100]} tick={{ fill:C.slateLight, fontSize:9 }} />
                <Radar name="VitalCore" dataKey="A" stroke={C.accent} fill={C.accent} fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ST>Governance Org Structure</ST>
            {[
              { label:"Executive Board", resp:"Strategic oversight & risk appetite" },
              { label:"Cloud Steering Committee", resp:"Architecture & vendor governance" },
              { label:"Security Office · Compliance · Operations", resp:"IAM/encryption · HIPAA/SOC 2 · Uptime/SLAs" },
            ].map((n, i) => (
              <div key={i} style={{ background:C.surfaceAlt, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 14px", marginLeft:i*14, marginBottom:6 }}>
                <div style={{ color:C.accent, fontSize:12, fontWeight:700 }}>{n.label}</div>
                <div style={{ color:C.slate, fontSize:11 }}>{n.resp}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <Insight text={`VitalCore's governance maturity score of ${maturity}% reflects ${af} open audit findings. HIPAA compliance at ${cs}% ${cs>=95?"meets the 95% audit target":"is below the 95% audit target — immediate remediation recommended"}.`} />
    </div>
  );
}

// ── Decision Rights ───────────────────────────────────────────────────────────
function DecisionRights() {
  const [selected, setSelected] = useState("Strategic");
  const [uptime, setUptime] = useState(99.9);
  const [response, setResponse] = useState(200);
  const [escalation, setEscalation] = useState(4);

  const workflows = {
    Strategic:["CIO proposes initiative","Cloud Steering reviews architecture","CFO approves budget","Executive Board ratifies","Implementation begins"],
    Budget:["Dept head requests spend","FinOps team reviews","CFO approves <$500K","CFO+CIO co-approve >$500K","Procurement executes"],
    Security:["CISO identifies risk","Security team assesses impact","Risk committee reviews","Board notified if critical","Remediation deployed"],
    Operational:["Ops team identifies need","Team lead approves <$10K","FinOps approves $10–50K","CIO approves >$50K","Change deployed"],
  };
  const sc = (v,g,w) => v>=g?C.green:v>=w?C.amber:C.red;

  return (
    <div>
      <PH title="Decision Rights & Operating Model" subtitle="Approval workflows, SLA targets, and governance operating model" />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="Uptime SLA" value={`${uptime}%`} color={sc(uptime,99.9,99.5)} />
        <KPI label="Response Time" value={`${response}ms`} color={sc(500-response,350,200)} />
        <KPI label="Escalation Target" value={`${escalation}h`} color={escalation<=4?C.green:C.red} />
        <KPI label="Compliance" value="HIPAA" color={C.green} sub="Active" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <ST>Decision Approval Workflow</ST>
          <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
            {Object.keys(workflows).map(k => (
              <button key={k} onClick={() => setSelected(k)} style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${selected===k?C.accent:C.border}`, cursor:"pointer", background:selected===k?C.accent:C.surface, color:selected===k?C.white:C.textMid, fontSize:12, fontWeight:600 }}>{k}</button>
            ))}
          </div>
          {workflows[selected].map((step, i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:C.accentSoft, color:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0, border:`1px solid #BFDBFE` }}>{i+1}</div>
              <div style={{ color:C.textMid, fontSize:13, paddingTop:2 }}>{step}</div>
            </div>
          ))}
        </Card>
        <Card>
          <ST>SLA Dashboard</ST>
          <Slider label="Uptime Target %" min={99} max={99.99} step={0.01} value={uptime} onChange={setUptime} format={v=>`${v}%`} />
          <Slider label="Response Time (ms)" min={50} max={1000} step={10} value={response} onChange={setResponse} format={v=>`${v}ms`} />
          <Slider label="Escalation Target (hrs)" min={1} max={24} step={1} value={escalation} onChange={setEscalation} format={v=>`${v}h`} />
          <div style={{ marginTop:14 }}>
            {[
              { label:"Uptime", val:`${uptime}%`, color:sc(uptime,99.9,99.5) },
              { label:"Response Time", val:`${response}ms`, color:sc(500-response,350,200) },
              { label:"Escalation SLA", val:`${escalation}h`, color:escalation<=4?C.green:C.red },
              { label:"HIPAA Audit", val:"Quarterly", color:C.green },
              { label:"Data Encryption", val:"AES-256", color:C.green },
            ].map(item => (
              <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.slate, fontSize:12 }}>{item.label}</span>
                <span style={{ color:item.color, fontSize:12, fontWeight:700 }}>{item.val}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Insight text={`VitalCore uses a ${selected} decision workflow with ${workflows[selected].length} approval gates. Critical HIPAA systems require ${escalation}h escalation windows with a ${uptime}% uptime SLA.`} />
    </div>
  );
}

// ── DevOps Simulator ──────────────────────────────────────────────────────────
function DevOpsSimulator() {
  const [automation, setAutomation] = useState(65);
  const [teamSize, setTeamSize] = useState(12);
  const [releaseFreq, setReleaseFreq] = useState(2);

  const deployFreq = Math.round((automation/100)*teamSize*releaseFreq*1.5);
  const failureRate = Math.max(1, 25-(automation*0.2)-(teamSize*0.3)).toFixed(1);
  const leadTime = Math.max(1, 14-(automation*0.1)-(releaseFreq*0.5)).toFixed(1);
  const mttr = Math.max(0.5, 4-(automation*0.03)).toFixed(1);
  const doraLevel = automation>70?"Elite":automation>50?"High":automation>30?"Medium":"Low";
  const doraColor = { Elite:C.green, High:C.teal, Medium:C.amber, Low:C.red }[doraLevel];
  const trend = [1,2,3,4,5].map(yr => ({
    year:`Y${yr}`,
    deployFreq: Math.round(deployFreq*(1+yr*0.15)),
    failureRate: Math.max(1, parseFloat(failureRate)-yr*0.8),
    leadTime: Math.max(1, parseFloat(leadTime)-yr*0.5),
  }));

  return (
    <div>
      <PH title="DevOps & Implementation Simulator" subtitle="DORA metrics, automation performance, and deployment trends" />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="Deploy Frequency" value={`${deployFreq}/mo`} color={C.accent} />
        <KPI label="Change Failure Rate" value={`${failureRate}%`} color={parseFloat(failureRate)<10?C.green:C.red} />
        <KPI label="Lead Time" value={`${leadTime}d`} color={parseFloat(leadTime)<7?C.green:C.amber} />
        <KPI label="MTTR" value={`${mttr}h`} color={parseFloat(mttr)<2?C.green:C.amber} />
        <KPI label="DORA Level" value={doraLevel} color={doraColor} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <Card>
          <ST>DevOps Inputs</ST>
          <Slider label="Automation %" min={0} max={100} step={1} value={automation} onChange={setAutomation} format={v=>`${v}%`} />
          <Slider label="Team Size" min={3} max={50} step={1} value={teamSize} onChange={setTeamSize} format={v=>`${v} engineers`} />
          <Slider label="Release Frequency" min={1} max={30} step={1} value={releaseFreq} onChange={setReleaseFreq} format={v=>`${v}x/mo`} />
          <div style={{ marginTop:16, padding:"12px", background:C.surfaceAlt, borderRadius:8, border:`1px solid ${C.border}` }}>
            <div style={{ color:C.slate, fontSize:11, marginBottom:8 }}>DORA Performance Level</div>
            {["Elite","High","Medium","Low"].map(l => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:{ Elite:C.green, High:C.teal, Medium:C.amber, Low:C.red }[l] }} />
                <span style={{ color:l===doraLevel?C.text:C.slateLight, fontSize:12, fontWeight:l===doraLevel?700:400 }}>{l}</span>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <ST>Deployment Frequency Trend</ST>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={trend}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tick={TICK} />
                <Tooltip contentStyle={TT} />
                <Area type="monotone" dataKey="deployFreq" stroke={C.accent} fill={C.accentSoft} name="Deploys/mo" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ST>Failure Rate & Lead Time Trend</ST>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={trend}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="year" tick={TICK} />
                <YAxis tick={TICK} />
                <Tooltip contentStyle={TT} />
                <Legend wrapperStyle={{ color:C.slate, fontSize:11 }} />
                <Line type="monotone" dataKey="failureRate" stroke={C.red} name="Failure Rate %" strokeWidth={2} />
                <Line type="monotone" dataKey="leadTime" stroke={C.amber} name="Lead Time (d)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <Insight text={`At ${automation}% automation with ${teamSize} engineers, VitalCore achieves ${doraLevel} DORA performance — ${deployFreq} deploys/month with ${failureRate}% failure rate. ${automation>70?"Automation above 70% drives 50% higher deploy frequency and 40% fewer failures.":"Increasing automation above 70% is recommended to reach Elite DORA performance."}`} />
    </div>
  );
}

// ── Resilience Dashboard ──────────────────────────────────────────────────────
function ResilienceDashboard() {
  const [redundancy, setRedundancy] = useState(3);
  const [regions, setRegions] = useState(2);
  const [rto, setRto] = useState(4);
  const [rpo, setRpo] = useState(1);

  const uptime = Math.min(99.999, 99 + redundancy*0.3 + regions*0.2);
  const monthlyCost = redundancy*8000 + regions*12000 + (4-rto)*3000;
  const riskScore = Math.max(1, 10 - redundancy*1.5 - regions*0.8 + rto*0.3 + rpo*0.2);
  const uptimeCurve = [1,2,3,4,5,6].map(r => ({
    redundancy:`R${r}`,
    uptime: Math.min(99.999, 99+r*0.3+regions*0.2),
    cost: (r*8000+regions*12000)/1000,
  }));
  const heatmap = [
    { risk:"Data Loss", likelihood:rpo>2?"High":"Low", score:rpo>2?9:2 },
    { risk:"System Downtime", likelihood:redundancy<2?"High":"Low", score:redundancy<2?8:2 },
    { risk:"Region Failure", likelihood:regions<2?"Medium":"Low", score:regions<2?6:2 },
    { risk:"Security Breach", likelihood:"Low", score:4 },
    { risk:"Cost Overrun", likelihood:redundancy>4?"Medium":"Low", score:redundancy>4?5:2 },
  ];

  return (
    <div>
      <PH title="Resilience & Availability Dashboard" subtitle="Cloud resilience simulation with uptime, cost, and risk heatmap" />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="Availability" value={`${uptime.toFixed(3)}%`} color={uptime>=99.9?C.green:C.amber} />
        <KPI label="Monthly Cost" value={`$${(monthlyCost/1e3).toFixed(0)}K`} color={C.amber} />
        <KPI label="Risk Score" value={`${riskScore.toFixed(1)}/10`} color={riskScore<4?C.green:C.red} />
        <KPI label="RTO" value={`${rto}h`} color={rto<=4?C.green:C.red} />
        <KPI label="RPO" value={`${rpo}h`} color={rpo<=1?C.green:C.amber} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <Card>
          <ST>Resilience Configuration</ST>
          <Slider label="Redundancy Level" min={1} max={6} step={1} value={redundancy} onChange={setRedundancy} format={v=>`Level ${v}`} />
          <Slider label="AWS Regions" min={1} max={4} step={1} value={regions} onChange={setRegions} format={v=>`${v} region${v>1?"s":""}`} />
          <Slider label="Recovery Time Objective (h)" min={0.5} max={24} step={0.5} value={rto} onChange={setRto} format={v=>`${v}h`} />
          <Slider label="Recovery Point Objective (h)" min={0.25} max={8} step={0.25} value={rpo} onChange={setRpo} format={v=>`${v}h`} />
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <ST>Uptime vs Cost Curve</ST>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={uptimeCurve}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="redundancy" tick={TICK} />
                <YAxis yAxisId="left" domain={[99,100]} tick={TICK} />
                <YAxis yAxisId="right" orientation="right" tick={TICK} />
                <Tooltip contentStyle={TT} />
                <Legend wrapperStyle={{ color:C.slate, fontSize:11 }} />
                <Line yAxisId="left" type="monotone" dataKey="uptime" stroke={C.green} name="Uptime %" strokeWidth={2} dot={{ r:3, fill:C.green }} />
                <Line yAxisId="right" type="monotone" dataKey="cost" stroke={C.amber} name="Cost ($K/mo)" strokeWidth={2} dot={{ r:3, fill:C.amber }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ST>Risk Heatmap</ST>
            {heatmap.map(r => (
              <div key={r.risk} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.text, fontSize:12 }}>{r.risk}</span>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ color:C.slate, fontSize:11 }}>{r.likelihood}</span>
                  <div style={{ width:28, height:14, borderRadius:4, background:r.score>7?C.red:r.score>4?C.amber:C.green, opacity:0.8 }} />
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <ST>Availability Scorecard</ST>
            {[
              { label:"Current Uptime", value:`${uptime.toFixed(3)}%`, target:"99.9%", met: uptime >= 99.9 },
              { label:"Monthly Cost", value:`$${(monthlyCost/1e3).toFixed(0)}K`, target:"< $60K", met: monthlyCost < 60000 },
              { label:"Risk Score", value:`${riskScore.toFixed(1)}/10`, target:"< 4.0", met: riskScore < 4 },
              { label:"Recovery Time (RTO)", value:`${rto}h`, target:"≤ 4h", met: rto <= 4 },
              { label:"Recovery Point (RPO)", value:`${rpo}h`, target:"≤ 1h", met: rpo <= 1 },
              { label:"Redundancy Level", value:`Level ${redundancy}`, target:"≥ Level 3", met: redundancy >= 3 },
            ].map(item => (
              <div key={item.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.textMid, fontSize:12 }}>{item.label}</span>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ color:C.slateLight, fontSize:11 }}>Target: {item.target}</span>
                  <span style={{ color: item.met ? C.green : C.red, fontSize:12, fontWeight:700 }}>{item.value}</span>
                  <span style={{ fontSize:13 }}>{item.met ? "✅" : "⚠️"}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <Insight text={`Redundancy Level ${redundancy} across ${regions} AWS region${regions>1?"s":""} achieves ${uptime.toFixed(3)}% availability at $${(monthlyCost/1e3).toFixed(0)}K/month. ${redundancy>=4?"Optimal redundancy achieved.":"Level "+(redundancy+1)+" would improve uptime ~0.3% for $8K/mo additional cost."}`} />
    </div>
  );
}

// ── AI Investment ─────────────────────────────────────────────────────────────
function AIInvestment() {
  const [inv, setInv] = useState(300);
  const [dq, setDq] = useState(75);
  const [ar, setAr] = useState(60);

  const roi = (inv>400?0.8:inv>200?1.2:1.0) * (dq/100) * (ar/100) * 2.5;
  const marginal = Math.max(0, 3-(inv/200));
  const efficiency = Math.min(100, (dq*0.5)+(ar*0.3)+(Math.min(inv,300)/300*20));
  const curve = [0,50,100,150,200,250,300,350,400,500].map(i => ({
    investment:`$${i}K`,
    roi: ((i>400?0.8:i>200?1.2:1.0)*(dq/100)*(ar/100)*2.5*(i/300)*100).toFixed(0),
    marginal: Math.max(0, 3-(i/200)).toFixed(2),
  }));

  return (
    <div>
      <PH title="AI Investment Explorer" subtitle="ROI curves, marginal returns, and investment efficiency analysis" />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="AI Investment" value={`$${inv}K`} color={C.accent} />
        <KPI label="Projected ROI" value={`${(roi*100).toFixed(0)}%`} color={roi>1.5?C.green:C.amber} />
        <KPI label="Marginal Return" value={`${marginal.toFixed(2)}x`} color={marginal>1?C.green:C.red} />
        <KPI label="Inv. Efficiency" value={`${efficiency.toFixed(0)}%`} color={efficiency>70?C.green:C.amber} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <Card>
          <ST>AI Strategy Inputs</ST>
          <Slider label="AI Investment ($K)" min={0} max={600} step={10} value={inv} onChange={setInv} format={v=>`$${v}K`} />
          <Slider label="Data Quality %" min={20} max={100} step={1} value={dq} onChange={setDq} format={v=>`${v}%`} />
          <Slider label="Adoption Rate %" min={10} max={100} step={1} value={ar} onChange={setAr} format={v=>`${v}%`} />
          <div style={{ marginTop:16, padding:"10px 14px", background:C.surfaceAlt, borderRadius:8, border:`1px solid ${C.border}` }}>
            <div style={{ color:C.slate, fontSize:11, marginBottom:6 }}>Investment Efficiency</div>
            <div style={{ background:C.border, borderRadius:4, height:8, marginBottom:4 }}>
              <div style={{ width:`${efficiency}%`, background:efficiency>70?C.green:C.amber, borderRadius:4, height:"100%", transition:"width 0.3s" }} />
            </div>
            <div style={{ color:C.text, fontSize:12, fontWeight:600 }}>{efficiency.toFixed(0)}% — {efficiency>80?"Peak performance zone":efficiency>60?"Good returns":"Optimize data quality first"}</div>
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <ST>ROI Growth Curve vs Investment</ST>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={curve}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="investment" tick={TICK} interval={2} />
                <YAxis tick={TICK} />
                <Tooltip contentStyle={TT} />
                <Area type="monotone" dataKey="roi" stroke={C.accent} fill={C.accentSoft} name="ROI %" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ST>Marginal Return Curve</ST>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={curve}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="investment" tick={TICK} interval={2} />
                <YAxis tick={TICK} />
                <Tooltip contentStyle={TT} />
                <ReferenceLine y={1} stroke={C.red} strokeDasharray="4 4" label={{ value:"Break-even", fill:C.red, fontSize:10 }} />
                <Line type="monotone" dataKey="marginal" stroke={C.amber} name="Marginal Return (x)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <Insight text={`At $${inv}K AI investment with ${dq}% data quality, VitalCore achieves ${(roi*100).toFixed(0)}% projected ROI. ${inv>400?"Returns are plateauing — prioritize data quality over additional spend.":"Increasing data quality above 80% is the highest-leverage action."}`} />
    </div>
  );
}

// ── Org Adoption ──────────────────────────────────────────────────────────────
function OrgAdoption() {
  const [training, setTraining] = useState(30);
  const [leadership, setLeadership] = useState(70);
  const [comms, setComms] = useState(65);

  const adoptionPeak = Math.min(95, training*0.4 + leadership*0.35 + comms*0.25);
  const resistance = Math.max(5, 100-adoptionPeak);
  const productivity = Math.min(40, training*0.3 + leadership*0.2);
  const readiness = Math.round(training*0.3 + leadership*0.4 + comms*0.3);
  const sCurve = [0,3,6,9,12,15,18,21,24].map(month => {
    const t = month/24;
    return {
      month:`M${month}`,
      adoption: Math.round(adoptionPeak / (1+Math.exp(-8*(t-0.4)))),
      target: Math.round(adoptionPeak * Math.min(1, month/18)),
    };
  });

  return (
    <div>
      <PH title="Organizational Adoption Dashboard" subtitle="Change management simulation — S-curve, resistance index, and readiness score" />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="Peak Adoption" value={`${adoptionPeak.toFixed(0)}%`} color={adoptionPeak>75?C.green:C.amber} />
        <KPI label="Resistance Index" value={`${resistance.toFixed(0)}%`} color={resistance<25?C.green:C.red} />
        <KPI label="Productivity Gain" value={`${productivity.toFixed(0)}%`} color={C.teal} />
        <KPI label="Readiness Score" value={`${readiness}%`} color={readiness>70?C.green:C.amber} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <Card>
          <ST>Change Management Inputs</ST>
          <Slider label="Training Hours" min={0} max={80} step={1} value={training} onChange={setTraining} format={v=>`${v}h`} />
          <Slider label="Leadership Engagement %" min={0} max={100} step={1} value={leadership} onChange={setLeadership} format={v=>`${v}%`} />
          <Slider label="Communication Effectiveness %" min={0} max={100} step={1} value={comms} onChange={setComms} format={v=>`${v}%`} />
          <div style={{ marginTop:14 }}>
            {[{label:"Training",value:training,max:80,color:C.accent},{label:"Leadership",value:leadership,max:100,color:C.teal},{label:"Comms",value:comms,max:100,color:C.amber}].map(item => (
              <div key={item.label} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ color:C.slate, fontSize:11 }}>{item.label}</span>
                  <span style={{ color:item.color, fontSize:11, fontWeight:600 }}>{item.value}{item.label==="Training"?"h":"%"}</span>
                </div>
                <div style={{ background:C.border, borderRadius:4, height:6 }}>
                  <div style={{ width:`${(item.value/item.max)*100}%`, background:item.color, borderRadius:4, height:"100%", transition:"width 0.3s" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <ST>Adoption S-Curve (24 months)</ST>
            <ResponsiveContainer width="100%" height={155}>
              <LineChart data={sCurve}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="month" tick={TICK} />
                <YAxis domain={[0,100]} tick={TICK} />
                <Tooltip contentStyle={TT} />
                <Legend wrapperStyle={{ color:C.slate, fontSize:11 }} />
                <Line type="monotone" dataKey="adoption" stroke={C.accent} name="Adoption %" strokeWidth={2} dot={{ r:3 }} />
                <Line type="monotone" dataKey="target" stroke={C.amber} name="Target %" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Card>
              <ST>Resistance Index</ST>
              <div style={{ textAlign:"center", padding:"14px 0" }}>
                <div style={{ fontSize:38, fontWeight:700, color:resistance<25?C.green:C.red }}>{resistance.toFixed(0)}%</div>
                <div style={{ color:C.slate, fontSize:12, marginTop:4 }}>{resistance<25?"Low — adoption on track":"High — intervention needed"}</div>
              </div>
            </Card>
            <Card>
              <ST>Readiness Score</ST>
              <div style={{ textAlign:"center", padding:"14px 0" }}>
                <div style={{ fontSize:38, fontWeight:700, color:readiness>70?C.green:C.amber }}>{readiness}%</div>
                <div style={{ color:C.slate, fontSize:12, marginTop:4 }}>{readiness>80?"Ready to scale":readiness>60?"On track":"Increase leadership"}</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Insight text={`With ${training}h training and ${leadership}% leadership engagement, VitalCore projects ${adoptionPeak.toFixed(0)}% peak adoption over 24 months. ${training>=30&&leadership>=70?"Training 30h+ with leadership >70% drives 80% adoption within 6 months.":"Increasing training and leadership engagement is the highest-leverage intervention."}`} />
    </div>
  );
}

// ── Market Diffusion ──────────────────────────────────────────────────────────
function MarketDiffusion() {
  const [marketingSpend, setMarketingSpend] = useState(200);
  const [networkEffect, setNetworkEffect] = useState(0.5);
  const [marketType, setMarketType] = useState("B2B");

  const innovators = 0.025;
  const imitators = networkEffect*0.4 + (marketType==="B2C"?0.15:0.08);
  const marketSize = marketType==="B2B" ? 500 : 2000;
  const diffusion = [0,3,6,9,12,15,18,21,24,30,36].map(month => {
    const t = month/12;
    const adopt = marketSize*(1-Math.exp(-(innovators+imitators)*t))*(marketingSpend/200);
    const cac = Math.max(500, 8000-marketingSpend*10-networkEffect*2000);
    const ltv = marketType==="B2B" ? 45000 : 800;
    return { month:`M${month}`, customers:Math.round(Math.min(adopt, marketSize*0.85)), cac:Math.round(cac), ltv, penetration:Math.round((Math.min(adopt,marketSize*0.85)/marketSize)*100) };
  });
  const fin = diffusion[diffusion.length-1];

  return (
    <div>
      <PH title="Product Diffusion & Market Expansion" subtitle="Bass diffusion model — customer growth, CAC vs LTV, and market penetration" />
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="Market Size" value={`${marketSize}`} color={C.accent} sub="organizations" />
        <KPI label="3-yr Penetration" value={`${fin.penetration}%`} color={fin.penetration>50?C.green:C.amber} />
        <KPI label="CAC" value={`$${(diffusion[3].cac/1e3).toFixed(1)}K`} color={diffusion[3].cac<diffusion[3].ltv?C.green:C.red} />
        <KPI label="LTV" value={`$${(diffusion[3].ltv/1e3).toFixed(0)}K`} color={C.teal} />
        <KPI label="LTV:CAC" value={`${(diffusion[3].ltv/diffusion[3].cac).toFixed(1)}x`} color={diffusion[3].ltv/diffusion[3].cac>3?C.green:C.amber} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <Card>
          <ST>Growth Inputs</ST>
          <Slider label="Marketing Spend ($K/mo)" min={20} max={500} step={10} value={marketingSpend} onChange={setMarketingSpend} format={v=>`$${v}K`} />
          <Slider label="Network Effect Strength" min={0} max={1} step={0.05} value={networkEffect} onChange={setNetworkEffect} format={v=>v.toFixed(2)} />
          <div style={{ marginBottom:14 }}>
            <div style={{ color:C.textMid, fontSize:12, fontWeight:500, marginBottom:8 }}>Market Type</div>
            <div style={{ display:"flex", gap:8 }}>
              {["B2B","B2C"].map(t => (
                <button key={t} onClick={() => setMarketType(t)} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${marketType===t?C.accent:C.border}`, cursor:"pointer", background:marketType===t?C.accent:C.surface, color:marketType===t?C.white:C.textMid, fontWeight:700, fontSize:13 }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ padding:"10px 14px", background:C.surfaceAlt, borderRadius:8, border:`1px solid ${C.border}` }}>
            <div style={{ color:C.slate, fontSize:11, marginBottom:4 }}>Market Penetration (36mo)</div>
            <div style={{ background:C.border, borderRadius:4, height:8, marginBottom:4 }}>
              <div style={{ width:`${fin.penetration}%`, background:fin.penetration>50?C.green:C.amber, borderRadius:4, height:"100%", transition:"width 0.3s" }} />
            </div>
            <div style={{ color:C.text, fontSize:12, fontWeight:600 }}>{fin.penetration}%</div>
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <ST>Customer Adoption S-Curve (36 months)</ST>
            <ResponsiveContainer width="100%" height={155}>
              <AreaChart data={diffusion}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="month" tick={TICK} />
                <YAxis tick={TICK} />
                <Tooltip contentStyle={TT} />
                <Area type="monotone" dataKey="customers" stroke={C.accent} fill={C.accentSoft} name="Customers" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ST>CAC vs LTV ($)</ST>
            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={diffusion.filter((_, i) => i%2===0)}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="month" tick={TICK} />
                <YAxis tick={TICK} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`} />
                <Tooltip contentStyle={TT} formatter={v=>`$${(v/1e3).toFixed(1)}K`} />
                <Legend wrapperStyle={{ color:C.slate, fontSize:11 }} />
                <Bar dataKey="cac" name="CAC ($)" fill={C.red} radius={[4,4,0,0]} fillOpacity={0.8} />
                <Bar dataKey="ltv" name="LTV ($)" fill={C.green} radius={[4,4,0,0]} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <Insight text={`In a ${marketType} market of ${marketSize} organizations, VitalCore achieves ${fin.penetration}% penetration over 36 months. ${networkEffect>0.6?"Strong network effects (>0.6) accelerate adoption dramatically.":"Increasing network effect above 0.6 is the key growth lever."} LTV:CAC of ${(diffusion[3].ltv/diffusion[3].cac).toFixed(1)}x ${diffusion[3].ltv/diffusion[3].cac>3?"signals healthy unit economics.":"needs improvement — target above 3x."}`} />
    </div>
  );
}

// ── Cost Management ───────────────────────────────────────────────────────────
function CostManagement() {
  const SERVICES = ["EC2","S3","RDS","Lambda","CloudFront","EKS","ElastiCache","Redshift"];
  const baseSpend = { EC2:12400, S3:3200, RDS:8700, Lambda:1100, CloudFront:2200, EKS:9500, ElastiCache:4100, Redshift:6800 };
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const [dateRange, setDateRange] = useState(6);
  const [granularity, setGranularity] = useState("Monthly");
  const [metric, setMetric] = useState("Unblended");
  const [groupBy, setGroupBy] = useState("Service");
  const [topN, setTopN] = useState(5);
  const [costReduction, setCostReduction] = useState(0);

  const timeData = Array.from({ length:dateRange }, (_, i) => {
    const m = months[(5-dateRange+1+i+12)%12];
    const noise = 0.85 + Math.sin(i)*0.12 + 0.05;
    const total = Object.values(baseSpend).reduce((s,v) => s+v, 0) * noise;
    return { month:m, actual:Math.round(total), projected:Math.round(total*(1-costReduction/100)) };
  });
  const serviceData = SERVICES.slice(0,topN).map(s => ({
    service:s,
    cost: Math.round(baseSpend[s]*(1-costReduction/100)),
    savings: Math.round(baseSpend[s]*costReduction/100),
  })).sort((a,b) => b.cost-a.cost);

  const totalSpend = serviceData.reduce((s,r) => s+r.cost, 0);
  const totalSavings = serviceData.reduce((s,r) => s+r.savings, 0);
  const top3 = serviceData.slice(0,3).reduce((s,r) => s+r.cost, 0) / (totalSpend||1) * 100;
  const mom = timeData.length>=2 ? ((timeData[timeData.length-1].actual - timeData[timeData.length-2].actual) / timeData[timeData.length-2].actual * 100).toFixed(1) : "0.0";
  const avg = timeData.reduce((s,r) => s+r.actual, 0) / (timeData.length||1);
  const anomaly = timeData.find(r => r.actual > avg*1.15);

  return (
    <div>
      <PH title="Cloud Cost Management Panel" subtitle="AWS Cost Explorer simulation — FinOps dashboard with anomaly detection" />
      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:14 }}>
        <span style={{ background:C.tealSoft, color:C.teal, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>DEMO MODE</span>
        <span style={{ color:C.slate, fontSize:12 }}>Synthetic AWS Cost Explorer data — connect AWS credentials for live data</span>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
        <KPI label="Total Spend" value={`$${(totalSpend/1e3).toFixed(1)}K`} color={C.accent} sub={`Top ${topN} services`} />
        <KPI label="Projected Savings" value={`$${(totalSavings/1e3).toFixed(1)}K`} color={C.green} sub={`${costReduction}% reduction`} />
        <KPI label="MoM Change" value={`${mom}%`} color={parseFloat(mom)<0?C.green:parseFloat(mom)>5?C.red:C.amber} />
        <KPI label="Top-3 Concentration" value={`${top3.toFixed(0)}%`} color={top3>70?C.amber:C.green} sub="of total spend" />
        {anomaly && <KPI label="⚠ Anomaly" value={anomaly.month} color={C.red} sub="Spend spike detected" />}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14 }}>
        <Card>
          <ST>Cost Explorer Controls</ST>
          <Slider label="Date Range (months)" min={1} max={12} step={1} value={dateRange} onChange={setDateRange} format={v=>`${v}mo`} />
          <div style={{ marginBottom:14 }}>
            <div style={{ color:C.textMid, fontSize:12, fontWeight:500, marginBottom:6 }}>Granularity</div>
            <div style={{ display:"flex", gap:6 }}>
              {["Daily","Monthly"].map(g => <button key={g} onClick={() => setGranularity(g)} style={{ flex:1, padding:"6px", borderRadius:8, border:`1px solid ${granularity===g?C.accent:C.border}`, cursor:"pointer", background:granularity===g?C.accent:C.surface, color:granularity===g?C.white:C.textMid, fontSize:12, fontWeight:600 }}>{g}</button>)}
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ color:C.textMid, fontSize:12, fontWeight:500, marginBottom:6 }}>Metric</div>
            <div style={{ display:"flex", gap:6 }}>
              {["Unblended","Amortized"].map(m => <button key={m} onClick={() => setMetric(m)} style={{ flex:1, padding:"6px", borderRadius:8, border:`1px solid ${metric===m?C.accent:C.border}`, cursor:"pointer", background:metric===m?C.accent:C.surface, color:metric===m?C.white:C.textMid, fontSize:12, fontWeight:600 }}>{m}</button>)}
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ color:C.textMid, fontSize:12, fontWeight:500, marginBottom:6 }}>Group By</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["Service","Region","Account"].map(g => <button key={g} onClick={() => setGroupBy(g)} style={{ padding:"5px 10px", borderRadius:20, border:`1px solid ${groupBy===g?C.accent:C.border}`, cursor:"pointer", background:groupBy===g?C.accent:C.surface, color:groupBy===g?C.white:C.textMid, fontSize:11, fontWeight:600 }}>{g}</button>)}
            </div>
          </div>
          <Slider label="Top-N Services" min={1} max={8} step={1} value={topN} onChange={setTopN} format={v=>`Top ${v}`} />
          <div style={{ marginTop:4, padding:"10px 12px", background:C.greenSoft, border:`1px solid #A7F3D0`, borderRadius:8 }}>
            <div style={{ color:C.green, fontSize:11, fontWeight:700, marginBottom:4 }}>FinOps Policy Lever</div>
            <Slider label="Cost-Reduction Policy %" min={0} max={30} step={1} value={costReduction} onChange={setCostReduction} format={v=>`${v}%`} />
          </div>
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <ST>Spend Over Time — {metric} Cost with Projected Savings</ST>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={timeData}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="month" tick={TICK} />
                <YAxis tick={TICK} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`} />
                <Tooltip contentStyle={TT} formatter={v=>`$${(v/1e3).toFixed(1)}K`} />
                <Legend wrapperStyle={{ color:C.slate, fontSize:11 }} />
                <Area type="monotone" dataKey="actual" stroke={C.accent} fill={C.accentSoft} name="Actual Spend" strokeWidth={2} />
                {costReduction>0 && <Area type="monotone" dataKey="projected" stroke={C.green} fill={C.greenSoft} name="Post-Policy Projection" strokeWidth={2} />}
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <ST>Top {topN} Services by Spend — Grouped by {groupBy}</ST>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={serviceData} layout="vertical">
                <CartesianGrid {...GRID} />
                <XAxis type="number" tick={TICK} tickFormatter={v=>`$${(v/1e3).toFixed(0)}K`} />
                <YAxis type="category" dataKey="service" tick={TICK} width={80} />
                <Tooltip contentStyle={TT} formatter={v=>`$${(v/1e3).toFixed(1)}K`} />
                <Legend wrapperStyle={{ color:C.slate, fontSize:11 }} />
                <Bar dataKey="cost" name="Current Spend" fill={C.accent} fillOpacity={0.85} radius={[0,4,4,0]} />
                {costReduction>0 && <Bar dataKey="savings" name="Savings" fill={C.green} fillOpacity={0.85} radius={[0,4,4,0]} />}
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <Insight text={`VitalCore's top ${topN} AWS services cost $${(totalSpend/1e3).toFixed(1)}K/${granularity==="Monthly"?"month":"day"}. Top-3 concentration is ${top3.toFixed(0)}% — ${top3>70?"high concentration risk":"healthy spread"}. ${costReduction>0?`Applying a ${costReduction}% FinOps policy projects $${(totalSavings/1e3).toFixed(1)}K in savings.`:"Use the FinOps Policy lever to simulate cost-reduction scenarios."}`} />
    </div>
  );
}

// ── About & Deployment ────────────────────────────────────────────────────────
function AboutDeployment() {
  const costRows = [
    { service:"AWS Amplify Hosting", detail:"Hosting + CI/CD builds", est:"$5–15/mo" },
    { service:"Amazon Cognito", detail:"Up to 50,000 MAU free tier", est:"$0–5/mo" },
    { service:"Amazon CloudFront CDN", detail:"~10 GB data transfer/mo", est:"$1–3/mo" },
    { service:"Amazon S3", detail:"Static asset storage", est:"$1–2/mo" },
    { service:"Total Estimated", detail:"Typical student/demo workload", est:"$7–25/mo" },
  ];

  const securityItems = [
    "HTTPS enforced on all Amplify-hosted endpoints via CloudFront",
    "JWT tokens issued by Cognito; short-lived access tokens (1 hour)",
    "Passwords hashed with bcrypt inside Cognito — never stored in plaintext",
    "All environment variables stored in Amplify Console (not in source code)",
    "Cognito user pool configured with email-based login only",
  ];

  const shutdownItems = [
    { title:"Delete the Amplify App", detail:"AWS Console → Amplify → select app → Actions → Delete app. Removes hosting, CI/CD, and associated CloudFront distribution immediately." },
    { title:"Delete the Cognito User Pool", detail:"AWS Console → Cognito → User pools → select pool → Delete. Removes all user accounts and authentication infrastructure." },
    { title:"Set AWS Budget Alert", detail:"AWS Console → Billing → Budgets → Create budget. Set a monthly threshold (e.g. $10) and receive email alerts before costs exceed the limit." },
    { title:"Enable Cost Explorer", detail:"AWS Console → Billing → Cost Explorer → Enable. Use daily granularity to catch unexpected spend spikes early." },
  ];

  return (
    <div>
      <PH title="About & Deployment" subtitle="AWS infrastructure overview, costs, security posture, and shutdown procedures" />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"auto auto", gap:16 }}>
        <Card>
          <ST>AWS Services Used</ST>
          {[
            { icon:"🏗", name:"Amplify Hosting", desc:"Serves the React SPA via CloudFront with CI/CD from GitHub" },
            { icon:"🔐", name:"Amazon Cognito", desc:"User pool for email/password auth with JWT tokens" },
            { icon:"🌐", name:"CloudFront CDN", desc:"Global edge caching for low-latency delivery" },
            { icon:"🗄", name:"Amazon S3", desc:"Stores static build artifacts and Amplify deployment bundles" },
          ].map((s, i, arr) => (
            <div key={i} style={{ display:"flex", gap:14, padding:"12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none", alignItems:"center", minHeight:56 }}>
              <div style={{ fontSize:22, flexShrink:0, width:32, textAlign:"center" }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:C.text, fontSize:14, fontWeight:600 }}>{s.name}</div>
                <div style={{ color:C.slate, fontSize:13, marginTop:3 }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <ST>GitHub Repository</ST>
            <a href="https://github.com/dkam4/CSCI176-Final-Project" target="_blank" rel="noreferrer"
              style={{ color:C.accent, fontSize:13, fontWeight:600, wordBreak:"break-all" }}>
              github.com/dkam4/CSCI176-Final-Project
            </a>
          </div>
        </Card>

        <Card>
          <ST>Estimated Monthly Cost</ST>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:C.surfaceAlt }}>
                <th style={{ padding:"9px 12px", textAlign:"left", color:C.slate, fontWeight:600, borderBottom:`1px solid ${C.border}` }}>Service</th>
                <th style={{ padding:"9px 12px", textAlign:"left", color:C.slate, fontWeight:600, borderBottom:`1px solid ${C.border}` }}>Detail</th>
                <th style={{ padding:"9px 12px", textAlign:"right", color:C.slate, fontWeight:600, borderBottom:`1px solid ${C.border}` }}>Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              {costRows.map((r, i) => (
                <tr key={r.service} style={{ background:i%2===0?C.surface:C.surfaceAlt }}>
                  <td style={{ padding:"9px 12px", color:i===costRows.length-1?C.text:C.textMid, fontWeight:i===costRows.length-1?700:400, borderBottom:`1px solid ${C.border}` }}>{r.service}</td>
                  <td style={{ padding:"9px 12px", color:C.slate, borderBottom:`1px solid ${C.border}` }}>{r.detail}</td>
                  <td style={{ padding:"9px 12px", textAlign:"right", color:i===costRows.length-1?C.green:C.accent, fontWeight:600, borderBottom:`1px solid ${C.border}` }}>{r.est}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <ST>Security Assumptions</ST>
          {securityItems.map((item, i) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.green, fontSize:15, flexShrink:0 }}>✓</span>
              <span style={{ color:C.textMid, fontSize:13, lineHeight:1.55 }}>{item}</span>
            </div>
          ))}
        </Card>

        <Card>
          <ST>Shutdown & Budget-Limiting Mechanisms</ST>
          {shutdownItems.map((item, i) => (
            <div key={i} style={{ display:"flex", gap:12, marginBottom:12, padding:"12px 14px", background:C.surfaceAlt, borderRadius:8, border:`1px solid ${C.border}` }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:C.accent, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{i+1}</div>
              <div>
                <div style={{ color:C.text, fontSize:14, fontWeight:600 }}>{item.title}</div>
                <div style={{ color:C.slate, fontSize:13, marginTop:4, lineHeight:1.55 }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Insight text="All AWS resources for this project operate within the free tier or under $25/month. Enable AWS Budgets with a $10 alert threshold to prevent unexpected charges. Deleting the Amplify app and Cognito user pool removes all billable infrastructure immediately." />
    </div>
  );
}

// ── Panel Map ─────────────────────────────────────────────────────────────────
const PANEL_MAP = [
  [ExecutiveSummary],
  [FinancialDashboard, ValueRealization],
  [CloudGovernance, DecisionRights],
  [DevOpsSimulator, ResilienceDashboard],
  [AIInvestment],
  [OrgAdoption, MarketDiffusion],
  [CostManagement],
  [AboutDeployment],
];

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [needsNewPassword, setNeedsNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)",
    borderRadius:8, padding:"11px 14px", color:C.white, fontSize:14, outline:"none",
    marginBottom:12, boxSizing:"border-box",
  };

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) { setError("Email and password are required."); return; }
    setLoading(true);
    try {
      if (needsConfirm) {
        await confirmSignUp({ username: email, confirmationCode: confirmCode });
        const r = await signIn({ username: email, password });
        if (r.isSignedIn) onLogin();
      } else if (needsNewPassword) {
        const r = await confirmSignIn({ challengeResponse: newPassword });
        if (r.isSignedIn) onLogin();
      } else if (mode === "login") {
        const r = await signIn({ username: email, password });
        if (r.isSignedIn) onLogin();
        else if (r.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") setNeedsNewPassword(true);
        else setError(`Sign-in step required: ${r.nextStep?.signInStep}`);
      } else {
        const r = await signUp({ username: email, password, options: { userAttributes: { email } } });
        if (r.isSignUpComplete) {
          const lr = await signIn({ username: email, password });
          if (lr.isSignedIn) onLogin();
        } else {
          setNeedsConfirm(true);
        }
      }
    } catch (e) {
      setError(e.message || "Authentication failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, display:"flex", alignItems:"center", justifyContent:"center", background:C.navy, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ width:400, maxWidth:"calc(100vw - 40px)" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:"#34D399", boxShadow:"0 0 8px #34D399" }} />
            <span style={{ color:C.white, fontWeight:700, fontSize:22, letterSpacing:0.5 }}>VitalCore Health</span>
          </div>
          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>AWS Cloud Migration Simulator</div>
        </div>

        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"28px 28px" }}>
          <div style={{ display:"flex", marginBottom:22, background:"rgba(0,0,0,0.2)", borderRadius:8, padding:3 }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setNeedsConfirm(false); }}
                style={{ flex:1, padding:"8px", borderRadius:6, border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                  background:mode===m?"rgba(37,99,235,0.9)":"transparent",
                  color:mode===m?C.white:"rgba(255,255,255,0.45)", transition:"all 0.15s" }}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {needsNewPassword ? (
            <>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:14, lineHeight:1.5 }}>
                Your account requires a new password before you can continue.
              </div>
              <input value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="New password" type="password" style={inputStyle}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </>
          ) : needsConfirm ? (
            <>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginBottom:14, lineHeight:1.5 }}>
                Check your email for a confirmation code and enter it below.
              </div>
              <input value={confirmCode} onChange={e => setConfirmCode(e.target.value)}
                placeholder="Confirmation code" style={inputStyle}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </>
          ) : (
            <>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" type="email" style={inputStyle}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              <input value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password" type="password" style={inputStyle}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </>
          )}

          {error && (
            <div style={{ background:"rgba(220,38,38,0.15)", border:"1px solid rgba(220,38,38,0.4)", borderRadius:8, padding:"9px 12px", color:"#FCA5A5", fontSize:13, marginBottom:12 }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width:"100%", background:loading?"rgba(37,99,235,0.5)":C.accent, border:"none", borderRadius:8, padding:"12px", color:C.white, fontWeight:700, fontSize:14, cursor:loading?"not-allowed":"pointer", transition:"background 0.15s" }}>
            {loading ? "Please wait…" : needsNewPassword ? "Set Password" : needsConfirm ? "Verify Code" : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState(0);
  const [activeSubs, setActiveSubs] = useState(NAV.map(() => 0));
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(u => { setUser(u); setAuthChecked(true); })
      .catch(() => setAuthChecked(true));
  }, []);

  const handleLogout = async () => {
    try { await signOut(); } catch {}
    setUser(null);
  };

  const activeSub = activeSubs[activeNav];
  const PanelComponent = PANEL_MAP[activeNav][activeSub];

  const setActiveSub = (i) => {
    setActiveSubs(prev => { const n = [...prev]; n[activeNav] = i; return n; });
  };

  if (!authChecked) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:C.navy, fontFamily:"'Inter',system-ui,sans-serif" }}>
        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:14 }}>Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        setUser({ username: "authenticated" });
      }
    }} />;
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", minHeight:"100vh", width:"100vw", maxWidth:"100%", background:C.bg, color:C.text, fontFamily:"'Inter',system-ui,sans-serif", position:"fixed", top:0, left:0, right:0, bottom:0, overflow:"hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { height: 100%; width: 100%; overflow: hidden; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        input[type=range] { height: 4px; }
      `}</style>
      <div style={{ padding:"10px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, background:C.navy, boxShadow:C.shadowMd }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#34D399", boxShadow:"0 0 6px #34D399" }} />
          <span style={{ color:C.white, fontWeight:700, fontSize:15, letterSpacing:0.5 }}>VitalCore Health</span>
          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:13 }}>AWS Cloud Migration Simulator</span>
          <span style={{ background:"rgba(52,211,153,0.15)", color:"#34D399", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>LIVE</span>
        </div>
        <button onClick={handleLogout} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:8, padding:"6px 14px", color:"rgba(255,255,255,0.7)", fontWeight:600, cursor:"pointer", fontSize:12 }}>
          Log Out
        </button>
      </div>

      <div style={{ display:"flex", overflowX:"auto", borderBottom:`1px solid ${C.border}`, flexShrink:0, background:C.surface, padding:"0 4px" }}>
        {NAV.map((tab, i) => (
          <button key={i} onClick={() => setActiveNav(i)} style={{ padding:"9px 12px", border:"none", background:"transparent", cursor:"pointer", color:activeNav===i?C.accent:C.slate, borderBottom:activeNav===i?`2px solid ${C.accent}`:"2px solid transparent", fontSize:11, fontWeight:activeNav===i?700:500, whiteSpace:"nowrap", transition:"color 0.15s", display:"flex", alignItems:"center", gap:5 }}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && <span style={{ background:C.tealSoft, color:C.teal, fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:20 }}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>
        <div style={{ flex:1, overflowY:"auto", padding:"18px 22px", minWidth:0 }}>
          {NAV[activeNav].subTabs.length > 1 && (
            <SubTabBar tabs={NAV[activeNav].subTabs} active={activeSub} onChange={setActiveSub} />
          )}
          <PanelComponent />
        </div>
      </div>
    </div>
  );
}
