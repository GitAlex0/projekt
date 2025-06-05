// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://mkyhoyqtovtxxtydpgsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1reWhveXF0b3Z0eHh0eWRwZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDM4ODYsImV4cCI6MjA2NDYxOTg4Nn0.Z72P5s69JUiOCZSBE39kS_BhjLPIaux44znvRU2APJo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


async function saveDataToDB(answers={}, points={}, jobScore={}, jobTopSkills={}, stats={}){
    const { error } = await supabase
  .from('bo-db')
  .insert({ answers: answers, points: points, jobScore: jobScore, jobTopSkills: jobTopSkills, stats: stats})
console.log("saved data to db")

}
async function read() {
    let { data, error } = await supabase
        .from('test')
        .select('*');
    console.log(data);
}

async function deleteRow() {
    const { data, error } = await supabase
  .from('bo-db')
  .delete()
  .contains('answers', { mycoolvalue: 1 });

if (error) {
  console.error('Error deleting rows:', error);
} else {
  console.log('Deleted rows:', data);
}
}


function prints(){
    console.log("ohimpriting")
}
