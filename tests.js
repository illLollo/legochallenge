const width = 50
const height = 25

const elaborate = async (i) => 
{
    console.log("START: " + Math.round((width / 4) * i) + " END: " + Math.round((width / 4) * i))
    for (let x = Math.round((width / 4) * i); x < Math.round(width / 4) + Math.round((width / 4) * i); x++)
    {
      for (let y = Math.round((height / 4) * i); y < Math.round(height / 4) + Math.round((height / 4) * i); y++)
      {
        console.log(x, y)
      }

    }

}
for (let i = 0; i < 4; i++)
{
    elaborate(i)
}
