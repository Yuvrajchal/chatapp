const SUPABASE_URL = "https://dzeabdvpuqqwofxklewa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6ZWFiZHZwdXFxd29meGtsZXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjgyNDgsImV4cCI6MjA3NzI0NDI0OH0.xIPv49TW-DYDyb-DFhbV1d6C5Kcs5Th2ouZUZ2hk_Dk";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await db.auth.signUp({ email, password });
  if (error) alert(error.message);
  else {
    alert("Registered!");
    window.location = "index.html";
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else {
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location = "home.html";
  }
}

async function sendMessage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const recipient = document.getElementById("recipient").value;
  const message = document.getElementById("messageInput").value;

  const { error } = await db.from("messages").insert([
    { sender: user.id, recipient, message }
  ]);

  if (error) alert(error.message);
  else {
    document.getElementById("messageInput").value = "";
    loadMessages();
  }
}

async function loadMessages() {
  const user = JSON.parse(localStorage.getItem("user"));
  const recipient = document.getElementById("recipient").value;
  const { data, error } = await db
    .from("messages")
    .select("*")
    .or(`and(sender.eq.${user.id},recipient.eq.${recipient}),and(sender.eq.${recipient},recipient.eq.${user.id})`)
    .order("created_at", { ascending: true });
  if (!error) {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = data.map(m => `<p><b>${m.sender}:</b> ${m.message}</p>`).join("");
  }
}
