const supabaseUrl = 'https://mkyhoyqtovtxxtydpgsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1reWhveXF0b3Z0eHh0eWRwZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDM4ODYsImV4cCI6MjA2NDYxOTg4Nn0.Z72P5s69JUiOCZSBE39kS_BhjLPIaux44znvRU2APJo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


async function saveDataToDB(answers = {}, points = {}, jobScore = {}, jobTopSkills = {}, stats = {}) {
  const cookieName = "dataUploaded";
  // Check if cookie exists
  if (document.cookie.split('; ').find(row => row.startsWith(cookieName + '='))) {
    console.log("Data already uploaded, skipping.");
    return;
  }

  const { error } = await supabase
    .from('bo-db')
    .insert({ answers, points, jobScore, jobTopSkills, stats });

  if (!error) {
    // Set cookie to mark data as uploaded (expires in 1 year)
    document.cookie = `${cookieName}=true; path=/; max-age=${60 * 60 * 24 * 365}`;
    console.log("Saved data to db and set cookie.");
  } else {
    console.error("Error saving data to db:", error);
  }
}