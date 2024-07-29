import htmr from "htmr";

export default function Pg({ soals,item, setPayload , payload }) {
  return (
    <div className="space-y-5">
      <div className="border-b-2 pb-2">{htmr(`<div>${soals.soal}</div>`)}</div>

      <div className="relative pl-12">
        <button onClick={()=> {

            const soal = payload.data.filter((x)=>  x.id === item.id)
            const index = payload.data.findIndex((x)=>  x.id === item.id)
        
            console.log('sssss', soal)
            console.log('xx', index)
            console.log('dddas', payload)
            setPayload((s)=> {
                return {
                    ...s,
                    data : s.data
                }
            })
        }} className="absolute  left-0  px-1 py-0 border-2 rounded-full text-gray-400">
          A
        </button>
        <div>{htmr(`<div>${soals.a}</div>`)}</div>
      </div>

      <div className="relative pl-12">
        <button className="absolute  left-0  px-1 py-0 border-2 rounded-full text-gray-400">
          B
        </button>
        <div>{htmr(`<div>${soals.b}</div>`)}</div>
      </div>

      <div className="relative pl-12">
        <button className="absolute  left-0  px-1 py-0 border-2 rounded-full text-gray-400">
          C
        </button>
        <div>{htmr(`<div>${soals.c}</div>`)}</div>
      </div>

      <div className="relative pl-12">
        <button className="absolute  left-0  px-1 py-0 border-2 rounded-full text-gray-400">
          D
        </button>
        <div>{htmr(`<div>${soals.d}</div>`)}</div>
      </div>

      <div className="relative pl-12">
        <button className="absolute  left-0  px-1 py-0 border-2 rounded-full text-gray-400">
          E
        </button>
        <div>{htmr(`<div>${soals.e}</div>`)}</div>
      </div>
    </div>
  );
}
