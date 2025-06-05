const supabaseUrl = 'https://mkyhoyqtovtxxtydpgsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1reWhveXF0b3Z0eHh0eWRwZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDM4ODYsImV4cCI6MjA2NDYxOTg4Nn0.Z72P5s69JUiOCZSBE39kS_BhjLPIaux44znvRU2APJo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


async function saveDataToDB(answers={}, points={}, jobScore={}, jobTopSkills={}, stats={}){
    const { error } = await supabase
  .from('bo-db')
  .insert({ answers: answers, points: points, jobScore: jobScore, jobTopSkills: jobTopSkills, stats: stats})
console.log("saved data to db")

}