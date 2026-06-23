import { Resend } from "resend";
import { resolve } from "path";
import { config } from "dotenv";
import fs from "fs";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ilm-naaafi.com";

if (!RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is not set in .env");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

// Define today's update content
const TODAYS_UPDATE_HTML = `
  <h3>Assalamu Alaykum, Students of Ilm Naafi Academy!</h3>
  <p>Here is your daily update on what has been recently added and improved in the sanctuary:</p>
  <ul>
    <li><strong>Scholars Platform Migration:</strong> We are actively migrating the Scholar Platform to a highly robust database to bring real-time collaboration with scholars!</li>
    <li><strong>Secure Password Recovery:</strong> You can now reset your access PIN securely via your academic email.</li>
    <li><strong>Design Upgrades:</strong> A cleaner, deeply academic interface for easier navigation and focus.</li>
  </ul>
  <p>May Allah bless your studies and increase you in beneficial knowledge.</p>
  <p>Best Regards,<br />Ilm Naafi Academy Team</p>
`;

async function runDailyUpdate() {
  console.log("Starting daily update broadcast...");

  let usersToEmail: any[] = [];
  
  // 1. Try fetching from the local SQLite fallback database first
  // Note: if you have completely migrated to Supabase, you would use your Supabase client here.
  const dbPath = resolve(process.cwd(), "db.json");
  if (fs.existsSync(dbPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      if (data.users && Array.isArray(data.users)) {
        usersToEmail = data.users;
      }
    } catch (err) {
      console.error("Could not read local DB:", err);
    }
  }

  if (usersToEmail.length === 0) {
    console.log("No users found to email. Ensure you have users in your database.");
    return;
  }

  console.log(`Found ${usersToEmail.length} users. Preparing emails...`);

  // Email them in batches
  for (const user of usersToEmail) {
    if (!user.email) continue;
    try {
      const resp = await resend.emails.send({
        from: `Ilm Naafi Academy <${ADMIN_EMAIL}>`,
        to: user.email,
        subject: "Ilm Naafi Academy - Daily Platform Updates",
        html: TODAYS_UPDATE_HTML,
      });

      console.log(`✅ Email sent to ${user.email}: ${resp.data ? resp.data.id : 'Success'}`);
    } catch (err) {
      console.error(`❌ Failed to send to ${user.email}:`, err);
    }
    
    // Slight delay to avoid hitting rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  console.log("Broadcast complete.");
}

runDailyUpdate().catch(console.error);
