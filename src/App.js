import { useState, useEffect, useRef } from "react";

const C = {
  pink:"#F4C0D1",pinkDark:"#993556",pinkLight:"#FBEAF0",
  cream:"#FAF7F2",white:"#FFFFFF",
  green:"#639922",greenLight:"#EAF3DE",
  yellow:"#BA7517",yellowLight:"#FAEEDA",
  orange:"#D85A30",orangeLight:"#FAECE7",
  red:"#A32D2D",redLight:"#FCEBEB",
  gray:"#888780",grayLight:"#F1EFE8",
  blue:"#185FA5",blueLight:"#E6F1FB",
  text:"#2C2C2A",muted:"#5F5E5A",
};

const GAS_URL = "https://script.google.com/macros/s/AKfycbygMIO5u6nH_Jx7afdvWOTLifygMKrpTSGtxYF6hhR0pwG6rSH7yX-Uurw-86-3LmE/exec";
const CLOUDINARY_CLOUD = "dfdghi7tj";
const CLOUDINARY_PRESET = "mori_staff"; // unsigned upload preset ที่ต้องสร้างใน Cloudinary

async function sendToSheets(action, data) {
  await new Promise(r => setTimeout(r, 800));
  console.log("📤 ส่งไป Sheets:", action, data);
  return true;
}

// อัปโหลดรูปไป Cloudinary แล้วได้ URL กลับมา
async function uploadPhoto(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET);
  fd.append("folder", "mori-staff-check");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: "POST", body: fd,
  });
  const json = await res.json();
  return json.secure_url || null;
}

// Component กล้อง/เลือกรูป
function PhotoCapture({ onPhoto, label = "📸 ถ่ายรูป/เลือกรูป", required = false }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(null);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const photoUrl = await uploadPhoto(file);
      setUrl(photoUrl);
      onPhoto && onPhoto(photoUrl);
    } catch(err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  }

  return (
    <div style={{marginBottom:10}}>
      <input ref={inputRef} type="file" accept="image/*" capture="environment"
        style={{display:"none"}} onChange={handleFile}/>
      {!preview ? (
        <button onClick={()=>inputRef.current.click()}
          style={{width:"100%",background:C.pinkLight,color:C.pinkDark,border:`1px dashed ${C.pink}`,borderRadius:10,padding:"12px",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {label}{required&&<span style={{color:C.red,fontSize:11}}>*จำเป็น</span>}
        </button>
      ) : (
        <div style={{position:"relative"}}>
          <img src={preview} alt="preview" style={{width:"100%",borderRadius:10,maxHeight:200,objectFit:"cover"}}/>
          {uploading && (
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontSize:13}}>⏳ กำลังอัปโหลด...</span>
            </div>
          )}
          {!uploading && url && (
            <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,0.6)",borderRadius:8,padding:"3px 8px"}}>
              <span style={{color:"#fff",fontSize:11}}>✓ อัปโหลดแล้ว</span>
            </div>
          )}
          <button onClick={()=>{setPreview(null);setUrl(null);onPhoto&&onPhoto(null);}}
            style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.6)",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,fontSize:12,cursor:"pointer"}}>✕</button>
        </div>
      )}
    </div>
  );
}

const DEFAULT_USERS = [
  {id:1,name:"คุณนาย เจ้าของ",role:"owner",avatar:"นจ",pin:"1111",dailyWage:0},
  {id:2,name:"เนย แมวรัก",role:"manager",avatar:"นม",pin:"2222",dailyWage:500},
  {id:3,name:"มินิ สาวน้อย",role:"staff",avatar:"มส",pin:"3333",dailyWage:400},
  {id:4,name:"แพม บาริสต้า",role:"staff",avatar:"พบ",pin:"4444",dailyWage:420},
  {id:5,name:"ออม ใจดี",role:"staff",avatar:"อจ",pin:"5555",dailyWage:380},
];

const CATS = ["โซจู","ดลใจ","วากิว","คุมะ","กอมเบ","โยชิ","ยูตะ","ชาไทย","บานอฟฟี่","น้ำตาล","นมสด","ทรัฟเฟิล","เลดี้","สโนว์","ชาแนล","ลาล่า","แพรพรรณ","คิวปิด","มัสตาร์ด","จินดี้","มะขาม","เจนนี่","นูเทลล่า","ข้าวพอง","เกรเทล","แซลลี่","รามิ","โรร่า","แคปหมู","อ่องปู","แพรไหม","แพรวา","มากิ","นิกิ","อากิ","โคลอี้","โมอา","โนอา","จินอา","ลีอา","ปีใหม่","คริสมาสต์"];
const KITTENS = [{id:"k1",name:"ลูกแมว (ขาวแต้มเทา)",emoji:"🐱"},{id:"k2",name:"ลูกแมว (จมูกดำ)",emoji:"🐾"},{id:"k3",name:"ลูกแมว (ลายเสือ)",emoji:"🐯"}];
const SPECIAL_CATS = ["โยชิ","ดลใจ","กอมเบ","โซจู","ลาล่า","ข้าวพอง","ปีใหม่","คริสมาสต์"];
const TASK_ROUNDS = [
  {time:"12:30",tasks:["เช็ดตา/จมูกแมว","เช็ครอยเปื้อนตามผนัง","เช็คความสะอาดโต๊ะ","เช็คข้าว/น้ำแมว"]},
  {time:"14:00",tasks:["เช็ดตา/จมูกแมว","เช็ครอยเปื้อนตามผนัง","เช็คความสะอาดโต๊ะ","เช็คข้าว/น้ำแมว","ให้แคทนิป","เช็คปลอกคอ/ตัดเศษด้าย"]},
  {time:"16:00",tasks:["เช็ดตา/จมูกแมว","เช็ครอยเปื้อนตามผนัง","เช็คความสะอาดโต๊ะ","เช็คข้าว/น้ำแมว"]},
  {time:"18:00",tasks:["เช็ดตา/จมูกแมว","เช็ครอยเปื้อนตามผนัง","เช็คความสะอาดโต๊ะ","เช็คข้าว/น้ำแมว","ให้แคทนิป","เช็คปลอกคอ/ตัดเศษด้าย"]},
  {time:"20:00",tasks:["เช็ดตา/จมูกแมว","เช็ครอยเปื้อนตามผนัง","เช็คความสะอาดโต๊ะ","เช็คข้าว/น้ำแมว"]},
  {time:"22:00",tasks:["เช็ดตา/จมูกแมว","เช็ครอยเปื้อนตามผนัง","เช็คข้าว/น้ำแมว","ให้แคทนิป","เช็คปลอกคอ/ตัดเศษด้าย"]},
];
const DAILY_TASKS_NAMES = ["ทำความสะอาดแมวที่ปล่อยห้องคาเฟ่","ทำความสะอาดห้องแมวเล็กรอบแรก","เช็ดตา หู หวีขน แมวในห้องเล็ก","เช็ดกระจกด้านในห้องคาเฟ่","เช็ดกระจกด้านนอกรอบร้านทุกบาน","กวาดหน้าร้าน รวมบนศาล","เติมน้ำไหว้ศาล","กวาดบริเวณกรวยหน้าร้าน","เช็ดโต๊ะหน้าร้าน","รดน้ำต้นไม้ และทิ้งขยะข้างร้าน","เช็ดโต๊ะข้างร้าน","กวาดข้างร้าน","เปิด/ปิดหน้าร้าน","ทำความสะอาดห้องน้ำ","ทำความสะอาดห้องแมวเล็กรอบเย็น","เช็คสต็อกของ","ป้อนยาแมว"];
const BARISTA_LIST = [{t:"11:30",n:"เปิดรั้ว/เปิดน้ำเด็ก/จัดโต๊ะหน้าร้าน"},{t:"11:40",n:"ดูดฝุ่น + ถูพื้น"},{t:"11:50",n:"เปิดไฟตู้เค้ก เรียงของ"},{t:"11:55",n:"เช็คความพร้อมทุกอย่างก่อนเปิดร้าน"},{t:"12:15",n:"เช็ดกระจกโซนห้องชงน้ำ"},{t:"12:25",n:"ทำความสะอาดแก้ว และเติมน้ำบนศาล (ส่งรูป)"},{t:"21:00",n:"เช็คสต็อกทุกอย่าง"},{t:"23:50",n:"เช็คเคลียร์เคาน์เตอร์"}];
const BATHROOM_ITEMS = ["ประตูห้องน้ำทุกบาน รวมถึงด้านหน้า","พื้นห้องน้ำ ด้านใน/นอก","โถส้วม","กระจก + ซิงค์ล้างมือ","กระดาษทิชชูใน/นอกห้องน้ำ","น้ำยาล้างมือ","จัดเรียงรองเท้าหน้าห้องน้ำ"];
const KITCHEN_ITEMS = ["กวาดพื้น + ถูพื้น","ดูดฝุ่น + เก็บขนแมวทุกจุด","เช็ดโต๊ะทั้งหมด","เช็คและทำความสะอาดเครื่องใช้ไฟฟ้า","จัดของ/เคลียร์ขยะ","เตรียมวัตถุดิบอาหาร","เช็คสต็อกวัตถุดิบอาหาร"];
const AUDIT_CATS = ["พื้นหน้าร้าน","โต๊ะลูกค้า","ห้องน้ำ","ห้องครัว","เคาน์เตอร์เครื่องดื่ม","ตู้เค้ก","น้ำแมว","อาหารแมว","กระบะทราย","ผนัง/รอยเปื้อน","ห้องแมวเล็ก"];
const POSITIONS = ["บาริสต้า","ดูแลแมว","ห้องน้ำ/ครัว","แคชเชียร์"];
const MONTHS = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const DAYS_TH = ["อา","จ","อ","พ","พฤ","ศ","ส"];

function mockAI(){
  const s=[92,87,76,65,88,95,71,83][Math.floor(Math.random()*8)];
  const notes=["ดูสะอาดเรียบร้อยดี ผ่านการตรวจ","พบคราบเล็กน้อยบริเวณพื้น แนะนำให้เช็ดซ้ำ","ภาพมืดเกินไป กรุณาถ่ายใหม่","รูปชัดเจน สภาพงานผ่านเกณฑ์","พบขนแมวบริเวณโต๊ะ แนะนำให้เช็ดเพิ่ม"];
  return{score:s,status:s>=80?"ผ่าน":s>=65?"ควรตรวจซ้ำ":"ไม่ผ่าน",note:notes[Math.floor(Math.random()*notes.length)]};
}

function Badge({s}){
  const m={"ผ่าน":[C.greenLight,C.green],"ส่งแล้ว":[C.blueLight,C.blue],"รอตรวจ":[C.yellowLight,C.yellow],"ใกล้ถึงเวลา":[C.yellowLight,C.yellow],"เลยเวลา":[C.orangeLight,C.orange],"ลืมงาน":[C.redLight,C.red],"ตีกลับ":[C.redLight,C.red],"ยังไม่ทำ":[C.grayLight,C.gray],"ยังไม่เข้างาน":[C.grayLight,C.gray],"เข้างานแล้ว":[C.greenLight,C.green],"มาสาย":[C.orangeLight,C.orange],"เลิกงานแล้ว":[C.blueLight,C.blue],"Gold":["#FAEEDA","#BA7517"],"Silver":["#D3D1C7","#5F5E5A"],"Bronze":["#F5C4B3","#993C1D"],"Warning":[C.redLight,C.red],"รอถ่ายรูป":[C.yellowLight,C.yellow],"ไม่ตอบสนอง":[C.redLight,C.red],"วางแผน":[C.blueLight,C.blue]};
  const[bg,tc]=m[s]||[C.grayLight,C.gray];
  return <span style={{background:bg,color:tc,fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:500,whiteSpace:"nowrap"}}>{s}</span>;
}
function Av({initials,size=36,bg=C.pinkLight,tc=C.pinkDark}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:bg,color:tc,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500,fontSize:size*0.33,flexShrink:0}}>{initials}</div>;
}
function Card({children,style={}}){
  return <div style={{background:C.white,borderRadius:12,border:"0.5px solid #E8E3DA",padding:"12px 14px",marginBottom:10,...style}}>{children}</div>;
}
function Sec({children}){return <div style={{fontSize:13,fontWeight:500,color:C.muted,marginBottom:8,marginTop:4}}>{children}</div>;}

function TaskModal({task:t, me, onClose, onSubmit, onApprove, onReject}){
  const[note,setNote]=useState(t?.note||"");
  const[uploading,setUploading]=useState(false);
  const[ai,setAi]=useState(t?.aiScore?{score:t.aiScore,status:t.aiStatus,note:t.aiNote}:null);
  if(!t) return null;
  const canSubmit=["ยังไม่ทำ","ตีกลับ","เลยเวลา","ลืมงาน","ใกล้ถึงเวลา"].includes(t.status);
  const canApprove=["รอตรวจ","ส่งแล้ว"].includes(t.status)&&(me?.role==="owner"||me?.role==="manager");
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.white,borderRadius:"16px 16px 0 0",padding:16,width:"100%",maxHeight:"85vh",overflowY:"auto",boxSizing:"border-box"}}>
        <div style={{fontWeight:500,fontSize:15,marginBottom:2}}>{t.name}</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:8}}>ผู้รับผิดชอบ: {t.assignee} · Deadline: {t.deadline} · ส่งจริง: {t.submittedAt||"—"}</div>
        <div style={{marginBottom:10,display:"flex",gap:6,flexWrap:"wrap"}}><Badge s={t.status}/>{t.aiStatus&&<Badge s={t.aiStatus}/>}</div>
        <div style={{fontSize:11,color:C.red,background:C.redLight,borderRadius:8,padding:"6px 10px",marginBottom:10}}>⚠️ กรุณาถ่ายรูปใหม่จากหน้างานเท่านั้น ห้ามใช้รูปเก่า</div>
        {t.history?.length>0&&(
          <div style={{marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:500,color:C.muted,marginBottom:6}}>ประวัติการแก้ไข</div>
            {t.history.map((h,i)=><div key={i} style={{background:C.cream,borderRadius:8,padding:"6px 10px",marginBottom:4,fontSize:11}}><span style={{color:C.muted}}>{h.time} · {h.by}</span> — {h.action}{h.note?` "${h.note}"`:""}</div>)}
          </div>
        )}
        {canSubmit&&<>
          <textarea placeholder="หมายเหตุ..." value={note} onChange={e=>setNote(e.target.value)} style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:8,fontSize:12,resize:"none",height:50,boxSizing:"border-box",fontFamily:"sans-serif",marginBottom:8}}/>
          {ai&&<div style={{background:ai.score>=80?C.greenLight:ai.score>=65?C.yellowLight:C.redLight,borderRadius:10,padding:10,marginBottom:10}}>
            <div style={{fontWeight:500,fontSize:13}}>🤖 AI วิเคราะห์รูป: {ai.score}/100</div>
            <div style={{fontSize:12,marginTop:2}}>ผล: {ai.status}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>{ai.note}</div>
          </div>}
          <button onClick={()=>{
            setUploading(true);
            setTimeout(()=>{const r=mockAI();setAi(r);setUploading(false);onSubmit(t.id,note,r);},1200);
          }} disabled={uploading} style={{width:"100%",background:C.pinkDark,color:"#fff",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:500,cursor:"pointer"}}>
            {uploading?"กำลังวิเคราะห์ AI... 🤖":"📸 ถ่ายรูปและส่งงาน"}
          </button>
        </>}
        {canApprove&&<div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={()=>{onApprove(t.id);onClose();}} style={{flex:1,background:C.greenLight,color:C.green,border:"none",borderRadius:8,padding:10,cursor:"pointer",fontSize:13}}>✓ ผ่าน</button>
          <button onClick={()=>{onReject(t.id);onClose();}} style={{flex:1,background:C.redLight,color:C.red,border:"none",borderRadius:8,padding:10,cursor:"pointer",fontSize:13}}>✗ ตีกลับ</button>
        </div>}
        {t.status==="ผ่าน"&&<div style={{background:C.greenLight,borderRadius:10,padding:10,marginTop:8}}><div style={{fontSize:12,color:C.green,fontWeight:500}}>✓ งานผ่านการตรวจแล้ว</div></div>}
        <button onClick={onClose} style={{width:"100%",background:C.grayLight,color:C.gray,border:"none",borderRadius:10,padding:"10px",marginTop:10,cursor:"pointer",fontSize:13}}>ปิด</button>
      </div>
    </div>
  );
}

export default function App(){
  const now = new Date();
  const timeStr = now.toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"});
  const dateStr = now.toLocaleDateString("th-TH",{weekday:"long",year:"numeric",month:"long",day:"numeric"});

  // ── state ──
  const[users,setUsers]=useState(DEFAULT_USERS);
  const[loggedIn,setLoggedIn]=useState(false);
  const[loginUser,setLoginUser]=useState(null);
  const[pinInput,setPinInput]=useState("");
  const[loginError,setLoginError]=useState("");
  const[editingStaff,setEditingStaff]=useState(null);
  const[editForm,setEditForm]=useState({});

  const[tab,setTab]=useState("today");
  const[subTab,setSubTab]=useState("round");
  const[scoreTab,setScoreTab]=useState("today");
  const[curMonth,setCurMonth]=useState(now.getMonth());
  const[calMonth,setCalMonth]=useState(new Date(now.getFullYear(),now.getMonth(),1));
  const[showNotif,setShowNotif]=useState(false);
  const[leaveModal,setLeaveModal]=useState(false);
  const[showAddShift,setShowAddShift]=useState(false);
  const[newShift,setNewShift]=useState({date:"",staffId:"",startTime:"11:30",endTime:"00:00",position:"บาริสต้า"});
  const[taskModal,setTaskModal]=useState(null);
  const[selectedCat,setSelectedCat]=useState(null);
  const[selectedKitten,setSelectedKitten]=useState(null);
  const[kittenForm,setKittenForm]=useState({time:timeStr,weight:"",milk:"",wetFood:"",poop:"",pee:"",bloated:"",note:""});
  const[catLogs,setCatLogs]=useState({});
  const[kittenLogs,setKittenLogs]=useState({k1:[],k2:[],k3:[]});
  const[auditActive,setAuditActive]=useState(null);
  const[auditTimer,setAuditTimer]=useState(300);
  const[syncing,setSyncing]=useState(false);
  const timerRef=useRef(null);

  // ── derived staff list from users ──
  const[staff,setStaff]=useState(()=>
    DEFAULT_USERS.map((u,i)=>({...u,
      checkIn:[null,"11:20","11:25","11:47",null][i],
      checkOut:null,
      status:["—","เข้างานแล้ว","เข้างานแล้ว","มาสาย","ยังไม่เข้างาน"][i],
      score:[0,94,87,62,42][i],
      level:["-","Gold","Silver","Bronze","Warning"][i],
    }))
  );

  const[tasks,setTasks]=useState(()=>
    TASK_ROUNDS.map((r,ri)=>r.tasks.map((t,ti)=>({
      id:`${ri}-${ti}`,round:r.time,name:t,
      assignee:DEFAULT_USERS[2+(ti%3)].name,
      deadline:r.time,status:"ยังไม่ทำ",
      photo:null,note:"",submittedAt:null,
      aiScore:null,aiStatus:null,aiNote:"",history:[],
    }))).flat()
  );
  const[dailyT,setDailyT]=useState(()=>DAILY_TASKS_NAMES.map((t,i)=>({id:`d${i}`,name:t,status:i<4?"ส่งแล้ว":"ยังไม่ทำ",assignee:DEFAULT_USERS[2+i%3].name,photo:i<4?"📸":null,note:"",submittedAt:i<4?"12:00":null,history:[]})));
  const[baristaT,setBaristaT]=useState(()=>BARISTA_LIST.map((t,i)=>({id:`b${i}`,time:t.t,name:t.n,status:i<2?"ส่งแล้ว":"ยังไม่ทำ",photo:i<2?"📸":null,note:"",submittedAt:i<2?"12:05":null,history:[]})));
  const[bathroomRows,setBathroomRows]=useState(()=>Array.from({length:30},(_,di)=>BATHROOM_ITEMS.map((item,ii)=>({id:`bt${di}-${ii}`,day:di+1,item,status:"ยังไม่ทำ",photo:null,note:""}))));
  const[kitchenRows,setKitchenRows]=useState(()=>Array.from({length:30},(_,di)=>KITCHEN_ITEMS.map((item,ii)=>({id:`kt${di}-${ii}`,day:di+1,item,status:"ยังไม่ทำ",photo:null,note:""}))));
  const[shifts,setShifts]=useState([
    {id:1,date:"2025-05-09",staffId:3,staffName:"มินิ สาวน้อย",startTime:"11:30",endTime:"00:00",position:"ดูแลแมว",status:"เข้างาน"},
    {id:2,date:"2025-05-09",staffId:4,staffName:"แพม บาริสต้า",startTime:"11:30",endTime:"00:00",position:"บาริสต้า",status:"สาย"},
    {id:3,date:"2025-05-09",staffId:5,staffName:"ออม ใจดี",startTime:"11:30",endTime:"00:00",position:"แคชเชียร์",status:"ไม่มา"},
    {id:4,date:"2025-05-10",staffId:3,staffName:"มินิ สาวน้อย",startTime:"11:30",endTime:"00:00",position:"บาริสต้า",status:"วางแผน"},
  ]);
  const[notifs,setNotifs]=useState([
    {id:1,msg:"ออม ใจดี ยังไม่เช็คอิน (เกินเวลา 15 นาที)",time:"11:45",read:false,urgent:true},
    {id:2,msg:"แพม บาริสต้า เช็คอินสาย 17 นาที",time:"11:47",read:false,urgent:false},
    {id:3,msg:"งานรอบ 12:30 มี 2 งานยังไม่ส่ง",time:"12:40",read:false,urgent:true},
    {id:4,msg:"มีงานรอตรวจ 3 รายการ",time:"13:00",read:true,urgent:false},
  ]);

  const me = loggedIn ? (staff.find(s=>s.id===loginUser?.id)||loginUser) : null;
  const unread = notifs.filter(n=>!n.read).length;
  const checkedIn = staff.filter(s=>s.checkIn&&!s.checkOut);
  const notIn = staff.filter(s=>!s.checkIn);
  const late = staff.filter(s=>s.status==="มาสาย");
  const overdueT = tasks.filter(t=>t.status==="เลยเวลา"||t.status==="ลืมงาน");
  const pendingT = tasks.filter(t=>t.status==="รอตรวจ"||t.status==="ส่งแล้ว");
  const doneT = tasks.filter(t=>t.status==="ผ่าน");
  const myStaff = staff.find(s=>s.id===me?.id);

  useEffect(()=>{
    if(auditActive?.status==="รอถ่ายรูป"){
      timerRef.current=setInterval(()=>{
        setAuditTimer(t=>{if(t<=1){clearInterval(timerRef.current);setAuditActive(a=>({...a,status:"ไม่ตอบสนอง"}));return 0;}return t-1;});
      },1000);
    }
    return()=>clearInterval(timerRef.current);
  },[auditActive?.id]);

  function addNotif(msg,urgent=false){setNotifs(n=>[{id:Date.now(),msg,time:timeStr,read:false,urgent},...n]);}

  function handleLogin(uid){const u=users.find(x=>x.id===uid);setLoginUser(u);setPinInput("");setLoginError("");}
  function handlePin(d){
    const p=pinInput+d; setPinInput(p);
    if(p.length===4){
      const fresh=users.find(x=>x.id===loginUser.id);
      if(p===(fresh?.pin||"")){ setLoggedIn(true);setLoginError(""); }
      else{ setLoginError("PIN ไม่ถูกต้อง");setPinInput(""); }
    }
  }
  function saveEditStaff(){
    const av=(editForm.name||"").slice(0,2);
    setUsers(us=>us.map(u=>u.id===editingStaff?{...u,...editForm,avatar:av}:u));
    setStaff(s=>s.map(u=>u.id===editingStaff?{...u,...editForm,avatar:av}:u));
    setEditingStaff(null);
  }
  async function handleCheckIn(){
    const t=now.getHours()*60+now.getMinutes();
    const st=t>11*60+30?"มาสาย":"เข้างานแล้ว";
    setStaff(s=>s.map(x=>x.id===me.id?{...x,checkIn:timeStr,status:st}:x));
    addNotif(st==="มาสาย"?`${me.name} เช็คอินสาย`:`${me.name} เช็คอินเรียบร้อย`);
    setSyncing(true);
    await sendToSheets("checkIn",{
      date: now.toISOString().slice(0,10),
      name: me.name, role: me.role,
      checkInTime: timeStr, status: st,
      gps: "13.7563,100.5018",
    });
    setSyncing(false);
  }
  async function handleCheckOut(){
    setStaff(s=>s.map(x=>x.id===me.id?{...x,checkOut:timeStr,status:"เลิกงานแล้ว"}:x));
    setSyncing(true);
    await sendToSheets("checkOut",{
      date: now.toISOString().slice(0,10),
      name: me.name, checkOutTime: timeStr, status:"เลิกงานแล้ว",
    });
    setSyncing(false);
  }
  async function handleSubmitTask(id,note,ai){
    const task=tasks.find(t=>t.id===id);
    setTasks(ts=>ts.map(t=>t.id===id?{...t,status:"รอตรวจ",submittedAt:timeStr,note,photo:"📸",aiScore:ai.score,aiStatus:ai.status,aiNote:ai.note,history:[...t.history,{time:timeStr,by:me.name,action:"ส่งงาน",note}]}:t));
    addNotif(`มีงานรอตรวจ: ${task?.name}`);
    setSyncing(true);
    await sendToSheets("submitTask",{
      date: now.toISOString().slice(0,10),
      round: task?.round, taskName: task?.name,
      assignee: task?.assignee, deadline: task?.deadline,
      submittedAt: timeStr, status:"รอตรวจ",
      hasPhoto: true, aiScore: ai.score, aiStatus: ai.status,
      note,
    });
    setSyncing(false);
  }
  async function handleApprove(id){
    const task=tasks.find(t=>t.id===id);
    setTasks(ts=>ts.map(t=>t.id===id?{...t,status:"ผ่าน",history:[...t.history,{time:timeStr,by:me.name,action:"อนุมัติ",note:""}]}:t));
    setSyncing(true);
    await sendToSheets("approveTask",{
      date: now.toISOString().slice(0,10),
      taskName: task?.name, assignee: task?.assignee,
      status:"ผ่าน", reviewer: me.name, result:"ผ่าน",
    });
    setSyncing(false);
  }
  async function handleReject(id){
    const task=tasks.find(t=>t.id===id);
    setTasks(ts=>ts.map(t=>t.id===id?{...t,status:"ตีกลับ",history:[...t.history,{time:timeStr,by:me.name,action:"ตีกลับ",note:""}]}:t));
    addNotif(`งาน "${task?.name}" ถูกตีกลับ`,true);
    setSyncing(true);
    await sendToSheets("approveTask",{
      date: now.toISOString().slice(0,10),
      taskName: task?.name, assignee: task?.assignee,
      status:"ตีกลับ", reviewer: me.name, result:"ตีกลับ",
    });
    setSyncing(false);
  }
  function startAudit(cat){
    const onShift=staff.filter(s=>s.checkIn&&!s.checkOut);
    const assignee=onShift[Math.floor(Math.random()*onShift.length)]||staff[1];
    setAuditActive({id:Date.now(),category:cat,assignee:assignee.name,status:"รอถ่ายรูป",createdAt:timeStr});
    setAuditTimer(300);
    addNotif(`🎲 สุ่มตรวจ "${cat}" — ${assignee.name} ต้องส่งรูปภายใน 5 นาที`,true);
  }

  const calFirst=new Date(calMonth.getFullYear(),calMonth.getMonth(),1).getDay();
  const calTotal=new Date(calMonth.getFullYear(),calMonth.getMonth()+1,0).getDate();

  const TABS=[{key:"today",label:"วันนี้",icon:"🏠"},{key:"checkin",label:"เข้างาน",icon:"⏰"},{key:"tasks",label:"เช็คงาน",icon:"✅"},{key:"cats",label:"สุขภาพแมว",icon:"🐱"},{key:"report",label:"รายงาน",icon:"📊"},{key:"settings",label:"ตั้งค่า",icon:"⚙️"}];

  // ── Login Screen ──
  if(!loggedIn){
    return(
      <div style={{fontFamily:"sans-serif",background:C.cream,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
        <div style={{fontSize:36,marginBottom:8}}>🐱</div>
        <div style={{fontSize:20,fontWeight:500,color:C.pinkDark,marginBottom:4}}>Mori Staff Check</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:28}}>เลือกบัญชีผู้ใช้</div>
        {!loginUser?(
          <div style={{width:"100%"}}>
            {users.map(u=>(
              <button key={u.id} onClick={()=>handleLogin(u.id)}
                style={{width:"100%",background:C.white,border:"0.5px solid #E8E3DA",borderRadius:12,padding:"12px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer",textAlign:"left"}}>
                <Av initials={u.avatar} size={40}/>
                <div><div style={{fontWeight:500,fontSize:14,color:C.text}}>{u.name}</div><div style={{fontSize:11,color:C.muted}}>{u.role==="owner"?"เจ้าของร้าน":u.role==="manager"?"ผู้จัดการ":"พนักงาน"}</div></div>
                <div style={{marginLeft:"auto",fontSize:18,color:C.muted}}>›</div>
              </button>
            ))}
          </div>
        ):(
          <div style={{width:"100%",textAlign:"center"}}>
            <Av initials={loginUser.avatar} size={60}/>
            <div style={{fontSize:16,fontWeight:500,marginTop:10,marginBottom:4}}>{loginUser.name}</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:20}}>กรอก PIN 4 หลัก</div>
            <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:16}}>
              {[0,1,2,3].map(i=><div key={i} style={{width:14,height:14,borderRadius:"50%",background:pinInput.length>i?C.pinkDark:"#E8E3DA"}}/>)}
            </div>
            {loginError&&<div style={{color:C.red,fontSize:12,marginBottom:12}}>{loginError}</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,maxWidth:220,margin:"0 auto"}}>
              {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d,i)=>(
                <button key={i} onClick={()=>{if(d==="⌫")setPinInput(p=>p.slice(0,-1));else if(d!=="")handlePin(String(d));}}
                  style={{padding:"14px",fontSize:18,borderRadius:12,border:"0.5px solid #E8E3DA",background:d===""?"transparent":C.white,cursor:d===""?"default":"pointer",color:C.text}}>
                  {d}
                </button>
              ))}
            </div>
            <button onClick={()=>{setLoginUser(null);setPinInput("");}} style={{marginTop:16,background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer"}}>← เลือกบัญชีอื่น</button>
          </div>
        )}
        <div style={{fontSize:10,color:C.muted,marginTop:24}}>Demo PIN: 1111 เจ้าของ / 2222 ผู้จัดการ / 3333–5555 พนักงาน</div>
      </div>
    );
  }

  // ── Main App ──
  return(
    <div style={{fontFamily:"sans-serif",fontSize:14,color:C.text,background:C.cream,minHeight:"100vh",maxWidth:430,margin:"0 auto",paddingBottom:80}}>
      {/* Header */}
      <div style={{background:C.white,padding:"12px 16px 10px",borderBottom:"0.5px solid #E8E3DA",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:16,fontWeight:500,color:C.pinkDark}}>🐱 Mori Staff Check</div><div style={{fontSize:11,color:C.muted}}>{dateStr}</div></div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setShowNotif(v=>!v)}>
              <span style={{fontSize:20}}>🔔</span>
              {unread>0&&<span style={{position:"absolute",top:-4,right:-4,background:C.red,color:"#fff",fontSize:9,borderRadius:10,padding:"1px 4px"}}>{unread}</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,background:C.pinkLight,borderRadius:20,padding:"4px 10px",cursor:"pointer"}} onClick={()=>{setLoggedIn(false);setLoginUser(null);}}>
              <Av initials={me?.avatar} size={22}/><span style={{fontSize:11,color:C.pinkDark,maxWidth:70,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{me?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notif Panel */}
      {showNotif&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:150}} onClick={e=>{if(e.target===e.currentTarget)setShowNotif(false);}}>
          <div style={{position:"absolute",top:56,right:8,width:300,background:C.white,borderRadius:12,border:"0.5px solid #E8E3DA",overflow:"hidden",maxHeight:400,overflowY:"auto"}}>
            <div style={{padding:"10px 14px",fontWeight:500,fontSize:13,borderBottom:"0.5px solid #E8E3DA",display:"flex",justifyContent:"space-between"}}><span>การแจ้งเตือน</span><span style={{color:C.muted,fontWeight:400,fontSize:12,cursor:"pointer"}} onClick={()=>setShowNotif(false)}>ปิด</span></div>
            {notifs.map(n=>(
              <div key={n.id} style={{padding:"10px 14px",borderBottom:"0.5px solid #E8E3DA",background:n.read?C.white:C.pinkLight,cursor:"pointer"}} onClick={()=>setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x))}>
                <div style={{fontSize:12,color:n.urgent?C.red:C.text}}>{n.urgent?"🔴":"🔔"} {n.msg}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{padding:"12px 14px"}}>

        {/* ══ TODAY ══ */}
        {tab==="today"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[{l:"เข้างานแล้ว",v:checkedIn.length,bg:C.greenLight,tc:C.green},{l:"ยังไม่เข้างาน",v:notIn.length,bg:C.grayLight,tc:C.gray},{l:"มาสาย",v:late.length,bg:C.orangeLight,tc:C.orange},{l:"งานเลยเวลา",v:overdueT.length,bg:C.redLight,tc:C.red}].map(it=>(
                <div key={it.l} style={{background:it.bg,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:500,color:it.tc}}>{it.v}</div><div style={{fontSize:11,color:it.tc}}>{it.l}</div>
                </div>
              ))}
            </div>
            <Sec>สถานะพนักงานวันนี้</Sec>
            {staff.map(s=>(
              <Card key={s.id}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Av initials={s.avatar}/>
                  <div style={{flex:1}}><div style={{fontWeight:500,fontSize:13}}>{s.name}</div><div style={{fontSize:11,color:C.muted}}>{s.checkIn?`เข้างาน ${s.checkIn}${s.checkOut?` · เลิก ${s.checkOut}`:""}` :"ยังไม่เช็คอิน"}</div></div>
                  <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end"}}><Badge s={s.status}/><Badge s={s.level}/></div>
                </div>
              </Card>
            ))}
            {(me?.role==="owner"||me?.role==="manager")&&<>
              <Sec>งานที่รอตรวจ ({pendingT.length})</Sec>
              {pendingT.slice(0,4).map(t=>(
                <Card key={t.id} style={{cursor:"pointer"}} onClick={()=>setTaskModal(t)}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:12,fontWeight:500}}>{t.name}</div><div style={{fontSize:11,color:C.muted}}>{t.assignee} · รอบ {t.round}</div>{t.aiScore&&<div style={{fontSize:11,color:C.blue}}>AI: {t.aiScore}/100 — {t.aiStatus}</div>}</div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={e=>{e.stopPropagation();handleApprove(t.id);}} style={{background:C.greenLight,color:C.green,border:"none",borderRadius:8,padding:"4px 10px",fontSize:12,cursor:"pointer"}}>ผ่าน</button>
                      <button onClick={e=>{e.stopPropagation();handleReject(t.id);}} style={{background:C.redLight,color:C.red,border:"none",borderRadius:8,padding:"4px 10px",fontSize:12,cursor:"pointer"}}>ตีกลับ</button>
                    </div>
                  </div>
                </Card>
              ))}
              {overdueT.length>0&&<><Sec>⚠️ งานลืม/งานตกหล่นวันนี้</Sec>{overdueT.slice(0,3).map(t=>(
                <Card key={t.id} style={{border:`1px solid ${C.red}`,cursor:"pointer"}} onClick={()=>setTaskModal(t)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><div style={{fontSize:12,fontWeight:500,color:C.red}}>{t.name}</div><div style={{fontSize:11,color:C.muted}}>{t.assignee} · Deadline {t.deadline}</div></div>
                    <Badge s={t.status}/>
                  </div>
                </Card>
              ))}</>}
              <Sec>สุ่มตรวจทันที</Sec>
              <Card>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                  {AUDIT_CATS.map(c=><button key={c} onClick={()=>startAudit(c)} style={{background:C.pinkLight,color:C.pinkDark,border:"none",borderRadius:16,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>{c}</button>)}
                </div>
                <button onClick={()=>startAudit(AUDIT_CATS[Math.floor(Math.random()*AUDIT_CATS.length)])} style={{width:"100%",background:C.pinkDark,color:"#fff",border:"none",borderRadius:10,padding:"10px",fontWeight:500,cursor:"pointer",fontSize:13}}>🎲 สุ่มตรวจทั้งหมด</button>
                {auditActive&&(
                  <div style={{marginTop:12,background:auditActive.status==="ไม่ตอบสนอง"?C.redLight:C.yellowLight,borderRadius:10,padding:10}}>
                    <div style={{fontWeight:500,fontSize:12}}>สุ่มตรวจ: {auditActive.category}</div>
                    <div style={{fontSize:11,color:C.muted}}>ผู้รับผิดชอบ: {auditActive.assignee}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}><Badge s={auditActive.status}/>{auditActive.status==="รอถ่ายรูป"&&<span style={{fontSize:12,color:C.orange,fontWeight:500}}>{Math.floor(auditTimer/60)}:{String(auditTimer%60).padStart(2,"0")}</span>}</div>
                    {auditActive.status==="รอถ่ายรูป"&&<button onClick={()=>{clearInterval(timerRef.current);setAuditActive(a=>({...a,status:"ส่งแล้ว"}));}} style={{marginTop:8,width:"100%",background:C.blue,color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:12,cursor:"pointer"}}>📸 ถ่ายรูปส่ง</button>}
                    {auditActive.status==="ส่งแล้ว"&&<div style={{display:"flex",gap:6,marginTop:8}}>
                      <button onClick={()=>setAuditActive(a=>({...a,status:"ผ่าน"}))} style={{flex:1,background:C.greenLight,color:C.green,border:"none",borderRadius:8,padding:"6px",fontSize:12,cursor:"pointer"}}>ผ่าน</button>
                      <button onClick={()=>setAuditActive(a=>({...a,status:"ไม่ผ่าน"}))} style={{flex:1,background:C.redLight,color:C.red,border:"none",borderRadius:8,padding:"6px",fontSize:12,cursor:"pointer"}}>ไม่ผ่าน</button>
                    </div>}
                  </div>
                )}
              </Card>
            </>}
            <Sec>สรุปงานวันนี้</Sec>
            <Card>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center"}}>
                {[{l:"ทั้งหมด",v:tasks.length,c:C.text},{l:"ผ่านแล้ว",v:doneT.length,c:C.green},{l:"เลยเวลา",v:overdueT.length,c:C.red}].map(it=>(
                  <div key={it.l}><div style={{fontSize:18,fontWeight:500,color:it.c}}>{it.v}</div><div style={{fontSize:10,color:C.muted}}>{it.l}</div></div>
                ))}
              </div>
              <div style={{marginTop:10}}><div style={{height:6,background:C.grayLight,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round(doneT.length/tasks.length*100)}%`,background:C.green,borderRadius:4}}/></div><div style={{fontSize:10,color:C.muted,marginTop:2}}>ความคืบหน้า {Math.round(doneT.length/tasks.length*100)}%</div></div>
            </Card>
          </div>
        )}

        {/* ══ CHECKIN ══ */}
        {tab==="checkin"&&(
          <div>
            <Card style={{textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:10}}><Av initials={me?.avatar} size={60}/></div>
              <div style={{fontSize:16,fontWeight:500}}>{me?.name}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:10}}>{me?.role==="owner"?"เจ้าของร้าน":me?.role==="manager"?"ผู้จัดการ":"พนักงาน"}</div>
              <div style={{fontSize:28,fontWeight:500,color:C.pinkDark,margin:"8px 0"}}>{timeStr}</div>
              <div style={{fontSize:12,color:C.muted}}>{dateStr}</div>
              <div style={{margin:"12px 0"}}><Badge s={myStaff?.status||"ยังไม่เข้างาน"}/></div>
            </Card>
            {!myStaff?.checkIn?(
              <Card>
                <div style={{fontSize:12,color:C.muted,marginBottom:8}}>หมายเหตุ (ถ้ามี)</div>
                <textarea placeholder="เช่น รถติด, ป่วย, มีเหตุจำเป็น..." style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:8,fontSize:12,resize:"none",height:60,boxSizing:"border-box",fontFamily:"sans-serif"}}/>
                <div style={{fontSize:11,color:C.muted,margin:"8px 0 4px"}}>📍 GPS: 13.7563, 100.5018</div>
                <button onClick={handleCheckIn} style={{width:"100%",background:C.pinkDark,color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:500,cursor:"pointer",marginTop:8}}>📸 เช็คอินเข้างาน</button>
              </Card>
            ):!myStaff?.checkOut?(
              <Card>
                <div style={{background:C.greenLight,borderRadius:10,padding:10,marginBottom:10}}><div style={{fontSize:12,color:C.green,fontWeight:500}}>✓ เช็คอินแล้ว เวลา {myStaff.checkIn}</div></div>
                <button onClick={handleCheckOut} style={{width:"100%",background:"#444",color:"#fff",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:500,cursor:"pointer"}}>📸 เช็คเอาต์เลิกงาน</button>
              </Card>
            ):(
              <Card><div style={{background:C.blueLight,borderRadius:10,padding:10}}><div style={{fontSize:12,color:C.blue,fontWeight:500}}>✓ เช็คเอาต์แล้ว เวลา {myStaff.checkOut}</div></div></Card>
            )}
            <Sec>สถานะพนักงานทั้งหมด</Sec>
            {staff.map(s=>(
              <Card key={s.id}><div style={{display:"flex",alignItems:"center",gap:10}}><Av initials={s.avatar}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{s.name}</div><div style={{fontSize:11,color:C.muted}}>{s.checkIn?`เข้า ${s.checkIn}`:""}{s.checkOut?` · เลิก ${s.checkOut}`:""}{!s.checkIn?"ยังไม่เช็คอิน":""}</div></div><Badge s={s.status}/></div></Card>
            ))}
            <button onClick={()=>setLeaveModal(true)} style={{width:"100%",background:C.pinkLight,color:C.pinkDark,border:`0.5px solid ${C.pink}`,borderRadius:10,padding:"10px",fontSize:13,cursor:"pointer",marginBottom:10}}>+ ยื่นคำขอลา / แจ้งเหตุ</button>
            {leaveModal&&(
              <Card style={{border:`1px solid ${C.pink}`}}>
                <div style={{fontWeight:500,marginBottom:8}}>ยื่นคำขอ</div>
                <select style={{width:"100%",padding:"8px",borderRadius:8,border:"0.5px solid #E8E3DA",marginBottom:8,fontSize:13}}>{["ลาป่วย","ลากิจ","ขาดงาน","มาสาย","กลับก่อน","ลืมเช็คอิน","ลืมเช็คเอาต์","ขอแก้ไขเวลา"].map(o=><option key={o}>{o}</option>)}</select>
                <textarea placeholder="เหตุผล..." style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:8,fontSize:12,resize:"none",height:60,boxSizing:"border-box",fontFamily:"sans-serif",marginBottom:8}}/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{addNotif("มีคำขอลางานรอการอนุมัติ");setLeaveModal(false);}} style={{flex:1,background:C.pinkDark,color:"#fff",border:"none",borderRadius:8,padding:10,cursor:"pointer",fontSize:13}}>ส่งคำขอ</button>
                  <button onClick={()=>setLeaveModal(false)} style={{flex:1,background:C.grayLight,color:C.gray,border:"none",borderRadius:8,padding:10,cursor:"pointer",fontSize:13}}>ยกเลิก</button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ══ TASKS ══ */}
        {tab==="tasks"&&(
          <div>
            <div style={{display:"flex",gap:6,marginBottom:10,overflowX:"auto",paddingBottom:4}}>
              {["round","daily","barista","bathroom","kitchen"].map(k=>(
                <button key={k} onClick={()=>setSubTab(k)} style={{flexShrink:0,padding:"6px 12px",borderRadius:20,border:"none",fontSize:12,cursor:"pointer",background:subTab===k?C.pinkDark:C.grayLight,color:subTab===k?"#fff":C.muted,fontWeight:subTab===k?500:400}}>
                  {k==="round"?"รอบงาน":k==="daily"?"งานรายวัน":k==="barista"?"บาริสต้า":k==="bathroom"?"ห้องน้ำ":"ห้องครัว"}
                </button>
              ))}
            </div>
            {subTab==="round"&&TASK_ROUNDS.map((round,ri)=>{
              const rt=tasks.filter(t=>t.round===round.time);
              const done=rt.filter(t=>["ผ่าน","รอตรวจ","ส่งแล้ว"].includes(t.status)).length;
              return(
                <Card key={ri}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontWeight:500}}>รอบ {round.time}</div><div style={{fontSize:11,color:C.muted}}>{done}/{rt.length}</div></div>
                  <div style={{height:4,background:C.grayLight,borderRadius:4,marginBottom:8,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round(done/rt.length*100)}%`,background:done===rt.length?C.green:C.pinkDark,borderRadius:4}}/></div>
                  {rt.map(t=>(
                    <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderTop:"0.5px solid #E8E3DA",cursor:"pointer"}} onClick={()=>setTaskModal(t)}>
                      <div><div style={{fontSize:12}}>{t.name}</div><div style={{fontSize:10,color:C.muted}}>{t.assignee} · {t.submittedAt?`ส่ง ${t.submittedAt}`:`Deadline ${t.deadline}`}</div></div>
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>{t.photo&&<span>📸</span>}<Badge s={t.status}/></div>
                    </div>
                  ))}
                </Card>
              );
            })}
            {subTab==="daily"&&dailyT.map(t=>(
              <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:C.white,borderRadius:10,marginBottom:6,border:"0.5px solid #E8E3DA",cursor:"pointer"}} onClick={()=>setTaskModal({...t,round:"รายวัน",deadline:"ก่อนเลิกงาน"})}>
                <div><div style={{fontSize:12}}>{t.name}</div><div style={{fontSize:10,color:C.muted}}>{t.assignee}{t.submittedAt?` · ส่ง ${t.submittedAt}`:""}</div></div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>{t.photo&&<span>📸</span>}<Badge s={t.status}/></div>
              </div>
            ))}
            {subTab==="barista"&&(
              <div>
                {baristaT.map(t=>(
                  <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:C.white,borderRadius:10,marginBottom:6,border:"0.5px solid #E8E3DA",cursor:"pointer"}} onClick={()=>setTaskModal({...t,round:"บาริสต้า",deadline:t.time,assignee:"แพม บาริสต้า"})}>
                    <div><div style={{fontSize:12}}>{t.name}</div><div style={{fontSize:10,color:C.muted}}>{t.time}{t.submittedAt?` · ส่ง ${t.submittedAt}`:""}</div></div>
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>{t.photo&&<span>📸</span>}<Badge s={t.status}/></div>
                  </div>
                ))}
                <Card style={{background:C.cream}}><div style={{fontSize:12,fontWeight:500,marginBottom:6}}>หมายเหตุ/ปัญหาที่เกิดขึ้น</div><textarea placeholder="บันทึกปัญหา..." style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:8,fontSize:12,resize:"none",height:60,boxSizing:"border-box",fontFamily:"sans-serif"}}/><button style={{marginTop:8,background:C.pinkDark,color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,cursor:"pointer"}}>บันทึก</button></Card>
              </div>
            )}
            {subTab==="bathroom"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <button onClick={()=>setCurMonth(m=>(m-1+12)%12)} style={{background:C.grayLight,border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12}}>←</button>
                  <span style={{fontSize:13,fontWeight:500}}>{MONTHS[curMonth]}</span>
                  <button onClick={()=>setCurMonth(m=>(m+1)%12)} style={{background:C.grayLight,border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12}}>→</button>
                </div>
                {[1,2,3,now.getDate()].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b).map(day=>(
                  <Card key={day}>
                    <div style={{fontWeight:500,fontSize:13,marginBottom:8}}>วันที่ {day}</div>
                    {BATHROOM_ITEMS.map((item,ii)=>{const row=bathroomRows[day-1]?.[ii];return(
                      <div key={ii} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"0.5px solid #E8E3DA"}}>
                        <span style={{fontSize:12,flex:1}}>{item}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          {row?.photo&&<span>📸</span>}
                          <select value={row?.status||"ยังไม่ทำ"} onChange={e=>{setBathroomRows(rows=>{const r=rows.map(d=>[...d]);r[day-1][ii]={...r[day-1][ii],status:e.target.value};return r;});}} style={{fontSize:11,border:"0.5px solid #E8E3DA",borderRadius:6,padding:"2px 4px"}}><option>ยังไม่ทำ</option><option>ส่งแล้ว</option><option>ผ่าน</option></select>
                          <button onClick={()=>setBathroomRows(rows=>{const r=rows.map(d=>[...d]);r[day-1][ii]={...r[day-1][ii],photo:"📸",status:"ส่งแล้ว"};return r;})} style={{background:C.pinkLight,color:C.pinkDark,border:"none",borderRadius:6,padding:"2px 6px",fontSize:10,cursor:"pointer"}}>📸</button>
                        </div>
                      </div>
                    );})}
                    <textarea placeholder="หมายเหตุ/ปัญหา..." style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:8,fontSize:12,resize:"none",height:40,boxSizing:"border-box",fontFamily:"sans-serif",marginTop:8}}/>
                  </Card>
                ))}
              </div>
            )}
            {subTab==="kitchen"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <button onClick={()=>setCurMonth(m=>(m-1+12)%12)} style={{background:C.grayLight,border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12}}>←</button>
                  <span style={{fontSize:13,fontWeight:500}}>{MONTHS[curMonth]}</span>
                  <button onClick={()=>setCurMonth(m=>(m+1)%12)} style={{background:C.grayLight,border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12}}>→</button>
                </div>
                {[1,2,3,now.getDate()].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b).map(day=>(
                  <Card key={day}>
                    <div style={{fontWeight:500,fontSize:13,marginBottom:8}}>วันที่ {day}</div>
                    {KITCHEN_ITEMS.map((item,ii)=>{const row=kitchenRows[day-1]?.[ii];return(
                      <div key={ii} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"0.5px solid #E8E3DA"}}>
                        <span style={{fontSize:12,flex:1}}>{item}</span>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          {row?.photo&&<span>📸</span>}
                          <select value={row?.status||"ยังไม่ทำ"} onChange={e=>{setKitchenRows(rows=>{const r=rows.map(d=>[...d]);r[day-1][ii]={...r[day-1][ii],status:e.target.value};return r;});}} style={{fontSize:11,border:"0.5px solid #E8E3DA",borderRadius:6,padding:"2px 4px"}}><option>ยังไม่ทำ</option><option>ส่งแล้ว</option><option>ผ่าน</option></select>
                          <button onClick={()=>setKitchenRows(rows=>{const r=rows.map(d=>[...d]);r[day-1][ii]={...r[day-1][ii],photo:"📸",status:"ส่งแล้ว"};return r;})} style={{background:C.pinkLight,color:C.pinkDark,border:"none",borderRadius:6,padding:"2px 6px",fontSize:10,cursor:"pointer"}}>📸</button>
                        </div>
                      </div>
                    );})}
                    <textarea placeholder="หมายเหตุ/ปัญหา..." style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:8,fontSize:12,resize:"none",height:40,boxSizing:"border-box",fontFamily:"sans-serif",marginTop:8}}/>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ CATS ══ */}
        {tab==="cats"&&(
          <div>
            <Card style={{background:C.pinkLight}}>
              <div style={{fontSize:12,fontWeight:500,color:C.pinkDark,marginBottom:6}}>แมวที่ต้องเช็ดตาด้วยน้ำอุ่นทุกวัน</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{SPECIAL_CATS.map(c=><span key={c} style={{background:C.white,color:C.pinkDark,fontSize:11,padding:"2px 8px",borderRadius:10,border:`0.5px solid ${C.pink}`}}>{c}</span>)}</div>
              <div style={{marginTop:8,fontSize:11,color:C.muted}}>เจนนี่ — เช็ดตัวและถ่ายรูปทุกวัน</div>
              <div style={{fontSize:11,color:C.orange}}>ข้าวพอง + โคลอี้ — ทายาแผล + ใส่คอลล่า</div>
            </Card>
            <Sec>🍼 ลูกแมวพิเศษ (เช็คได้หลายครั้งต่อวัน)</Sec>
            {KITTENS.map(k=>{
              const logs=kittenLogs[k.id]||[];const last=logs[logs.length-1];
              return(
                <Card key={k.id} style={{border:`1px solid ${C.pink}`,cursor:"pointer"}} onClick={()=>{setSelectedKitten(k);setKittenForm({time:timeStr,weight:"",milk:"",wetFood:"",poop:"",pee:"",bloated:"",note:""});}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:28}}>{k.emoji}</span>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:C.pinkDark}}>{k.name}</div><div style={{fontSize:11,color:C.muted}}>บันทึกวันนี้: {logs.length} ครั้ง</div>{last&&<div style={{fontSize:10,color:C.muted}}>ล่าสุด {last.time} · {last.weight?`${last.weight}g`:"—"}</div>}</div>
                    <div style={{background:C.pinkLight,color:C.pinkDark,fontSize:20,width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>+</div>
                  </div>
                  {logs.length>0&&<div style={{marginTop:8,display:"flex",gap:4,flexWrap:"wrap"}}>{[...logs].reverse().slice(0,4).map((l,i)=><div key={i} style={{background:C.cream,borderRadius:8,padding:"3px 8px",fontSize:10,color:C.muted}}>{l.time}{l.weight?` · ${l.weight}g`:""}{l.milk==="ใช่"?"🍼":""}{l.poop==="ใช่"?"💩":""}{l.pee==="ใช่"?"💧":""}</div>)}</div>}
                </Card>
              );
            })}
            <Sec>รายชื่อแมวทั้งหมด ({CATS.length} ตัว)</Sec>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {CATS.map((cat,i)=>{const log=catLogs[cat];return(
                <div key={cat} onClick={()=>setSelectedCat(cat)} style={{background:log?.abnormal?C.redLight:C.white,border:`0.5px solid ${log?.abnormal?C.red:"#E8E3DA"}`,borderRadius:10,padding:"8px 10px",cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13}}>🐱 {cat}</span><span style={{fontSize:10,color:C.muted}}>#{i+1}</span></div>
                  {log&&<div style={{fontSize:10,color:log.abnormal?C.red:C.green,marginTop:2}}>{log.abnormal?"⚠️ พบความผิดปกติ":"✓ เช็คแล้ว"}</div>}
                  {SPECIAL_CATS.includes(cat)&&<div style={{fontSize:9,color:C.pinkDark,marginTop:1}}>★ งานพิเศษ</div>}
                </div>
              );})}
            </div>
          </div>
        )}

        {/* ══ REPORT ══ */}
        {tab==="report"&&(
          <div>
            <Sec>ตารางกะ/ปฏิทิน</Sec>
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <button onClick={()=>setCalMonth(m=>new Date(m.getFullYear(),m.getMonth()-1,1))} style={{background:C.grayLight,border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12}}>←</button>
                <span style={{fontWeight:500,fontSize:14}}>{MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
                <button onClick={()=>setCalMonth(m=>new Date(m.getFullYear(),m.getMonth()+1,1))} style={{background:C.grayLight,border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:12}}>→</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center",marginBottom:6}}>
                {DAYS_TH.map(d=><div key={d} style={{fontSize:10,color:C.muted,padding:"4px 0",fontWeight:500}}>{d}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,textAlign:"center"}}>
                {Array.from({length:calFirst}).map((_,i)=><div key={`e${i}`}/>)}
                {Array.from({length:calTotal}).map((_,i)=>{
                  const d=i+1;
                  const ds=`${calMonth.getFullYear()}-${String(calMonth.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                  const ds2=shifts.filter(s=>s.date===ds);
                  const isToday=d===now.getDate()&&calMonth.getMonth()===now.getMonth()&&calMonth.getFullYear()===now.getFullYear();
                  return(
                    <div key={d} style={{padding:"4px 2px",borderRadius:6,background:isToday?C.pinkDark:ds2.length>0?C.pinkLight:"transparent",cursor:"pointer"}}>
                      <div style={{fontSize:11,fontWeight:500,color:isToday?"#fff":C.text}}>{d}</div>
                      {ds2.length>0&&<div style={{fontSize:8,color:isToday?"#fff":C.pinkDark}}>{ds2.length}คน</div>}
                    </div>
                  );
                })}
              </div>
            </Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <Sec>กะวันนี้</Sec>
              {(me?.role==="owner"||me?.role==="manager")&&<button onClick={()=>setShowAddShift(true)} style={{background:C.pinkDark,color:"#fff",border:"none",borderRadius:8,padding:"5px 12px",fontSize:12,cursor:"pointer"}}>+ เพิ่มกะ</button>}
            </div>
            {shifts.filter(s=>s.date==="2025-05-09").map(s=>(
              <Card key={s.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:500}}>{s.staffName}</div><div style={{fontSize:11,color:C.muted}}>{s.position} · {s.startTime}–{s.endTime}</div></div><Badge s={s.status==="เข้างาน"?"เข้างานแล้ว":s.status==="สาย"?"มาสาย":s.status==="ไม่มา"?"ยังไม่เข้างาน":"วางแผน"}/></div></Card>
            ))}
            {showAddShift&&(
              <Card style={{border:`1px solid ${C.pink}`}}>
                <div style={{fontWeight:500,marginBottom:10}}>เพิ่มกะใหม่</div>
                {[{l:"วันที่",k:"date",type:"date"},{l:"เวลาเข้า",k:"startTime",type:"time"},{l:"เวลาเลิก",k:"endTime",type:"time"}].map(f=>(
                  <div key={f.k} style={{marginBottom:8}}><div style={{fontSize:11,color:C.muted,marginBottom:3}}>{f.l}</div><input type={f.type} value={newShift[f.k]} onChange={e=>setNewShift(s=>({...s,[f.k]:e.target.value}))} style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:"7px 10px",fontSize:13,boxSizing:"border-box"}}/></div>
                ))}
                <div style={{marginBottom:8}}><div style={{fontSize:11,color:C.muted,marginBottom:3}}>พนักงาน</div><select value={newShift.staffId} onChange={e=>setNewShift(s=>({...s,staffId:e.target.value}))} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"0.5px solid #E8E3DA",fontSize:13}}><option value="">เลือกพนักงาน</option>{users.filter(u=>u.role!=="owner").map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
                <div style={{marginBottom:10}}><div style={{fontSize:11,color:C.muted,marginBottom:3}}>ตำแหน่ง</div><select value={newShift.position} onChange={e=>setNewShift(s=>({...s,position:e.target.value}))} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"0.5px solid #E8E3DA",fontSize:13}}>{POSITIONS.map(p=><option key={p}>{p}</option>)}</select></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{if(!newShift.date||!newShift.staffId)return;const u=users.find(x=>x.id===parseInt(newShift.staffId));setShifts(s=>[...s,{id:Date.now(),...newShift,staffName:u.name,status:"วางแผน"}]);setShowAddShift(false);}} style={{flex:1,background:C.pinkDark,color:"#fff",border:"none",borderRadius:8,padding:10,cursor:"pointer",fontSize:13}}>บันทึก</button>
                  <button onClick={()=>setShowAddShift(false)} style={{flex:1,background:C.grayLight,color:C.gray,border:"none",borderRadius:8,padding:10,cursor:"pointer",fontSize:13}}>ยกเลิก</button>
                </div>
              </Card>
            )}
            <Sec>คะแนนพนักงาน</Sec>
            <div style={{display:"flex",gap:6,marginBottom:10}}>{["today","week","month"].map(t=><button key={t} onClick={()=>setScoreTab(t)} style={{flex:1,padding:"6px",borderRadius:8,border:"none",fontSize:12,cursor:"pointer",background:scoreTab===t?C.pinkDark:C.grayLight,color:scoreTab===t?"#fff":C.muted}}>{t==="today"?"วันนี้":t==="week"?"สัปดาห์":"เดือน"}</button>)}</div>
            {[...staff].filter(s=>s.role!=="owner").sort((a,b)=>b.score-a.score).map((s,i)=>(
              <Card key={s.id}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:[C.yellowLight,C.grayLight,C.orangeLight,C.grayLight][i]||C.grayLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500,color:[C.yellow,C.gray,C.orange,C.gray][i]||C.gray}}>{i+1}</div>
                  <Av initials={s.avatar} size={32}/>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{s.name}</div><div style={{height:4,background:C.grayLight,borderRadius:4,marginTop:4,overflow:"hidden"}}><div style={{height:"100%",width:`${s.score}%`,background:s.score>=90?"#BA7517":s.score>=70?"#888780":s.score>=50?C.orange:C.red,borderRadius:4}}/></div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:500}}>{s.score}</div><Badge s={s.level}/></div>
                </div>
              </Card>
            ))}
            <Sec>สรุปค่าแรง</Sec>
            {staff.filter(s=>s.role!=="owner").map(s=>{
              const u=users.find(x=>x.id===s.id);
              const wage=u?.dailyWage||0;
              const fine=s.status==="มาสาย"?50:0;
              const net=s.checkIn?Math.max(0,wage-fine):0;
              return(
                <Card key={s.id}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><Av initials={s.avatar} size={28}/><div style={{fontWeight:500,fontSize:13}}>{s.name}</div><span style={{marginLeft:"auto",fontSize:11,color:C.muted}}>฿{wage}/วัน</span></div>
                  <div style={{fontSize:11}}>
                    {[{l:"วันทำงาน",v:s.checkIn?"1 วัน":"0 วัน"},{l:"ค่าแรง",v:`฿${s.checkIn?wage:0}`},{l:"ค่าปรับ",v:fine?`-฿${fine}`:"฿0",c:fine?C.red:C.text}].map(it=>(
                      <div key={it.l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{color:C.muted}}>{it.l}</span><span style={{color:it.c||C.text}}>{it.v}</span></div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",borderTop:"0.5px solid #E8E3DA",marginTop:4,paddingTop:4}}><span style={{fontWeight:500}}>ยอดสุทธิ</span><span style={{fontWeight:500,color:C.green}}>฿{net}</span></div>
                  </div>
                </Card>
              );
            })}
            <button style={{width:"100%",background:C.grayLight,color:C.gray,border:"none",borderRadius:10,padding:"10px",cursor:"pointer",fontSize:13}}>📥 Export CSV</button>
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {tab==="settings"&&(
          <div>
            {me?.role!=="owner"&&<div style={{background:C.yellowLight,borderRadius:10,padding:10,marginBottom:10,fontSize:12,color:C.yellow}}>⚠️ การตั้งค่าบางส่วนสงวนสำหรับเจ้าของร้านเท่านั้น</div>}
            <Sec>การตั้งค่าร้าน</Sec>
            <Card>{[{l:"เวลาเปิดร้าน",v:"12:00"},{l:"เวลาเข้างานมาตรฐาน",v:"11:30"},{l:"เวลาเลิกงาน",v:"00:00"},{l:"เวลาห้ามเกิน",v:"02:00"}].map(it=>(
              <div key={it.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"0.5px solid #E8E3DA"}}><span style={{fontSize:13}}>{it.l}</span><input type="time" defaultValue={it.v} disabled={me?.role!=="owner"} style={{fontSize:13,border:"0.5px solid #E8E3DA",borderRadius:6,padding:"3px 6px",opacity:me?.role!=="owner"?0.5:1}}/></div>
            ))}</Card>
            <Sec>การแจ้งเตือน</Sec>
            <Card>{["แจ้งเตือนก่อนเวลาเข้างาน 15 นาที","แจ้งเตือนเมื่อยังไม่เช็คอิน","แจ้งเตือนก่อนถึงเวลางาน 10 นาที","แจ้งเตือนเมื่องานเลยเวลา","แจ้งเตือนให้เช็คเอาต์ก่อนเลิกงาน","แจ้งเตือนเมื่อเกิน 02:00 ยังไม่เช็คเอาต์","แจ้งเตือนเจ้าของเมื่อมีงานรอตรวจ","แจ้งเตือนพนักงานเมื่องานถูกตีกลับ"].map(label=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"0.5px solid #E8E3DA"}}><span style={{fontSize:12,flex:1,paddingRight:10}}>{label}</span><input type="checkbox" defaultChecked/></div>
            ))}</Card>
            <Sec>พนักงานและค่าแรง</Sec>
            {staff.map(s=>{
              const u=users.find(x=>x.id===s.id);
              return(
                <Card key={s.id}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <Av initials={s.avatar}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:500}}>{s.name}</div>
                      <div style={{fontSize:11,color:C.muted}}>{s.role==="owner"?"เจ้าของร้าน":s.role==="manager"?"ผู้จัดการ":"พนักงาน"}{u?.dailyWage?` · ฿${u.dailyWage}/วัน`:""}</div>
                    </div>
                    {me?.role==="owner"&&s.role!=="owner"&&(
                      <button onClick={()=>{setEditingStaff(s.id);setEditForm({name:s.name,role:s.role,pin:u?.pin||"",dailyWage:u?.dailyWage||0});}}
                        style={{background:C.pinkLight,color:C.pinkDark,border:"none",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>แก้ไข</button>
                    )}
                  </div>
                  {editingStaff===s.id&&(
                    <div style={{marginTop:12,paddingTop:12,borderTop:"0.5px solid #E8E3DA"}}>
                      {[{l:"ชื่อ-นามสกุล",k:"name",type:"text"},{l:"PIN (4 หลัก)",k:"pin",type:"text"},{l:"ค่าแรงต่อวัน (฿)",k:"dailyWage",type:"number"}].map(f=>(
                        <div key={f.k} style={{marginBottom:8}}>
                          <div style={{fontSize:11,color:C.muted,marginBottom:3}}>{f.l}</div>
                          <input type={f.type} value={editForm[f.k]||""} onChange={e=>setEditForm(ef=>({...ef,[f.k]:f.type==="number"?Number(e.target.value):e.target.value}))} style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:"7px 10px",fontSize:13,boxSizing:"border-box"}}/>
                        </div>
                      ))}
                      <div style={{marginBottom:10}}><div style={{fontSize:11,color:C.muted,marginBottom:3}}>ตำแหน่ง</div><select value={editForm.role} onChange={e=>setEditForm(ef=>({...ef,role:e.target.value}))} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"0.5px solid #E8E3DA",fontSize:13}}><option value="staff">พนักงาน</option><option value="manager">ผู้จัดการ</option></select></div>
                      <div style={{display:"flex",gap:8}}>
                        <button onClick={saveEditStaff} style={{flex:1,background:C.pinkDark,color:"#fff",border:"none",borderRadius:8,padding:"8px",fontSize:13,cursor:"pointer"}}>บันทึก</button>
                        <button onClick={()=>setEditingStaff(null)} style={{flex:1,background:C.grayLight,color:C.gray,border:"none",borderRadius:8,padding:"8px",fontSize:13,cursor:"pointer"}}>ยกเลิก</button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
            {me?.role==="owner"&&<button style={{width:"100%",background:C.pinkLight,color:C.pinkDark,border:`0.5px solid ${C.pink}`,borderRadius:10,padding:"10px",marginBottom:10,cursor:"pointer",fontSize:13}}>+ เพิ่มพนักงาน</button>}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {taskModal&&<TaskModal task={tasks.find(x=>x.id===taskModal.id)||taskModal} me={me} onClose={()=>setTaskModal(null)} onSubmit={handleSubmitTask} onApprove={handleApprove} onReject={handleReject}/>}

      {/* Cat Modal */}
      {selectedCat&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)setSelectedCat(null);}}>
          <div style={{background:C.white,borderRadius:"16px 16px 0 0",padding:16,width:"100%",maxHeight:"85vh",overflowY:"auto",boxSizing:"border-box"}}>
            <div style={{fontWeight:500,fontSize:15,marginBottom:4}}>🐱 {selectedCat}</div>
            {["ใบหน้า ตา/จมูก/ปาก","หู","แผ่นหลัง","หน้าท้อง","ลำตัว","ขา","เท้า/เล็บ","หาง","ขน","การกิน","การเดิน","ภาพรวม"].map(item=>(
              <div key={item} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"0.5px solid #E8E3DA"}}><span style={{fontSize:12}}>{item}</span><select style={{fontSize:11,border:"0.5px solid #E8E3DA",borderRadius:6,padding:"2px 4px"}}><option>ปกติ</option><option>ผิดปกติ</option><option>ไม่ได้ตรวจ</option></select></div>
            ))}
            <div style={{marginTop:10}}><label style={{fontSize:12,fontWeight:500}}><input type="checkbox" style={{marginRight:6}} onChange={e=>setCatLogs(l=>({...l,[selectedCat]:{...l[selectedCat],abnormal:e.target.checked}}))}/>พบความผิดปกติ</label></div>
            {catLogs[selectedCat]?.abnormal&&<div style={{marginTop:8,background:C.redLight,borderRadius:10,padding:10}}>
              <textarea placeholder="รายละเอียดอาการ..." style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:8,fontSize:12,resize:"none",height:50,boxSizing:"border-box",fontFamily:"sans-serif",marginBottom:8}}/>
              <select style={{width:"100%",padding:8,borderRadius:8,border:"0.5px solid #E8E3DA",fontSize:12}}><option>ความเร่งด่วน: ต่ำ</option><option>ความเร่งด่วน: กลาง</option><option>ความเร่งด่วน: สูง — แจ้งเจ้าของทันที!</option></select>
            </div>}
            <textarea placeholder="หมายเหตุเพิ่มเติม..." style={{width:"100%",borderRadius:8,border:"0.5px solid #E8E3DA",padding:8,fontSize:12,resize:"none",height:50,boxSizing:"border-box",fontFamily:"sans-serif",marginTop:8}}/>
            <button onClick={()=>{setCatLogs(l=>({...l,[selectedCat]:{...l[selectedCat],checked:true,time:timeStr}}));setSelectedCat(null);}} style={{width:"100%",background:C.pinkDark,color:"#fff",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:500,cursor:"pointer",marginTop:10}}>📸 บันทึกและส่งรูป</button>
            <button onClick={()=>setSelectedCat(null)} style={{width:"100%",background:C.grayLight,color:C.gray,border:"none",borderRadius:10,padding:"10px",marginTop:8,cursor:"pointer",fontSize:13}}>ปิด</button>
          </div>
        </div>
      )}

      {/* Kitten Modal */}
      {selectedKitten&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:100,display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)setSelectedKitten(null);}}>
          <div style={{background:C.white,borderRadius:"16px 16px 0 0",padding:16,width:"100%",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:24}}>{selectedKitten.emoji}</span><div><div style={{fontWeight:500,fontSize:15,color:C.pinkDark}}>{selectedKitten.name}</div><div style={{fontSize:11,color:C.muted}}>บันทึกวันนี้ {(kittenLogs[selectedKitten.id]||[]).length} ครั้ง</div></div></div>
            {(kittenLogs[selectedKitten.id]||[]).length>0&&<div style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:500,color:C.muted,marginBottom:6}}>ประวัติวันนี้</div>
              {[...(kittenLogs[selectedKitten.id]||[])].reverse().map((l,i)=>(
                <div key={i} style={{background:C.cream,borderRadius:10,padding:"8px 10px",marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,fontWeight:500}}>⏰ {l.time}</span>{l.photo&&<span style={{fontSize:11}}>📸</span>}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                    {[{label:"น้ำหนัก",val:l.weight?`${l.weight}g`:"—"},{label:"กินนมแม่",val:l.milk||"—"},{label:"กินเปียก",val:l.wetFood||"—"},{label:"อึ",val:l.poop||"—"},{label:"ฉี่",val:l.pee||"—"},{label:"ท้องอืด",val:l.bloated||"—"}].map(it=>(
                      <div key={it.label} style={{fontSize:11}}><span style={{color:C.muted}}>{it.label}: </span><span style={{fontWeight:500,color:it.val==="ใช่"?(it.label==="ท้องอืด"?C.red:C.green):C.text}}>{it.val}</span></div>
                    ))}
                  </div>
                  {l.note&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>หมายเหตุ: {l.note}</div>}
                </div>
              ))}
            </div>}
            <div style={{background:C.pinkLight,borderRadius:12,padding:12}}>
              <div style={{fontSize:13,fontWeight:500,color:C.pinkDark,marginBottom:10}}>+ บันทึกรอบใหม่</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>⏰ เวลา</span>
                <input type="time" value={kittenForm.time} onChange={e=>setKittenForm(f=>({...f,time:e.target.value}))} style={{flex:1,padding:"6px 10px",borderRadius:8,border:`0.5px solid ${C.pink}`,fontSize:13,background:C.white}}/>
                <button onClick={()=>setKittenForm(f=>({...f,time:timeStr}))} style={{background:C.pinkDark,color:"#fff",border:"none",borderRadius:8,padding:"6px 10px",fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>ตอนนี้</button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,background:C.white,borderRadius:10,padding:"8px 10px"}}>
                <span style={{fontSize:20}}>⚖️</span>
                <div style={{flex:1}}><div style={{fontSize:11,color:C.muted}}>น้ำหนัก (กรัม) — ต้องถ่ายรูปตาชั่ง</div><input type="number" placeholder="เช่น 125" value={kittenForm.weight} onChange={e=>setKittenForm(f=>({...f,weight:e.target.value}))} style={{width:"100%",border:"none",fontSize:15,fontWeight:500,outline:"none",marginTop:2,background:"transparent"}}/></div>
                <button style={{background:C.cream,border:`0.5px solid ${C.pink}`,borderRadius:8,padding:"6px 10px",fontSize:11,cursor:"pointer",color:C.pinkDark}}>📸 รูป</button>
              </div>
              {[{key:"milk",label:"🍼 กินนมแม่ไหม",options:["ใช่","ไม่","กินนิดหน่อย"]},{key:"wetFood",label:"🥩 กินเปียกหมดไหม",options:["หมด","กินบางส่วน","ไม่กิน"]},{key:"poop",label:"💩 อึ",options:["ใช่","ไม่","ช่วยบีบ"]},{key:"pee",label:"💧 ฉี่",options:["ใช่","ไม่","ช่วยบีบ"]},{key:"bloated",label:"🫃 ท้องอืดไหม",options:["ไม่อืด","อืดเล็กน้อย","อืดมาก"]}].map(field=>(
                <div key={field.key} style={{marginBottom:10}}>
                  <div style={{fontSize:12,fontWeight:500,marginBottom:5}}>{field.label}</div>
                  <div style={{display:"flex",gap:6}}>{field.options.map(opt=><button key={opt} onClick={()=>setKittenForm(f=>({...f,[field.key]:opt}))} style={{flex:1,padding:"7px 4px",borderRadius:8,border:`0.5px solid ${kittenForm[field.key]===opt?C.pinkDark:C.pink}`,fontSize:11,cursor:"pointer",background:kittenForm[field.key]===opt?C.pinkDark:C.white,color:kittenForm[field.key]===opt?"#fff":C.text}}>{opt}</button>)}</div>
                </div>
              ))}
              <textarea placeholder="หมายเหตุ เช่น ซึมผิดปกติ, จาม..." value={kittenForm.note} onChange={e=>setKittenForm(f=>({...f,note:e.target.value}))} style={{width:"100%",borderRadius:8,border:`0.5px solid ${C.pink}`,padding:8,fontSize:12,resize:"none",height:50,boxSizing:"border-box",fontFamily:"sans-serif",background:C.white,marginBottom:10}}/>
              <button onClick={()=>{if(!kittenForm.time)return;setKittenLogs(l=>({...l,[selectedKitten.id]:[...(l[selectedKitten.id]||[]),{...kittenForm,photo:kittenForm.weight?"📸":null,recordedBy:me?.name}]}));setKittenForm({time:timeStr,weight:"",milk:"",wetFood:"",poop:"",pee:"",bloated:"",note:""});}} style={{width:"100%",background:C.pinkDark,color:"#fff",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:500,cursor:"pointer"}}>บันทึกรอบนี้</button>
            </div>
            <button onClick={()=>setSelectedKitten(null)} style={{width:"100%",background:C.grayLight,color:C.gray,border:"none",borderRadius:10,padding:"10px",marginTop:10,cursor:"pointer",fontSize:13}}>ปิด</button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.white,borderTop:"0.5px solid #E8E3DA",display:"flex",zIndex:20}}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{flex:1,border:"none",background:"none",padding:"8px 2px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <span style={{fontSize:9,color:tab===t.key?C.pinkDark:C.muted,fontWeight:tab===t.key?500:400}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
