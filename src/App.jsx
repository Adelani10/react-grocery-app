import { useState } from 'react'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'

function App() {
  const [text, setText] = useState('')
  const [groceryList, setGroceryList] = useState(getGroceryList())
  const [isEditing, setIsEditing] = useState(false)
  const [alert, setAlert] = useState({show: false, msg: '', condition: ''})
  const [editId, setEditId] = useState(null)

  function getGroceryList () {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []
  }

  function handleSubmit(event) {
    event.preventDefault()

    if(text && !isEditing){
      const newItem = {id: nanoid(), value:text}
      setGroceryList([...groceryList, newItem])
      setText('')
      displayAlert(true, 'one item added', 'success')
    }
    else if(text && isEditing){
      setGroceryList(
        groceryList.map(item => {
          if(item.id === editId){
            return {...item, value: text}
          }
          return item
        })
      )

      setText('')
      setEditId(null)
      setIsEditing(false)
      displayAlert(true, 'one item edited', 'success')
    }
    else{
      setGroceryList(groceryList)
      displayAlert(true, 'Please enter an item', 'danger')
    }

  }


  function deleteItem (id) {
     const remainingItem = groceryList.filter((item)=> {
        if(item.id !== id) {
          return item
        }
    })
    setGroceryList(remainingItem)
    displayAlert(true, 'one item removed', 'danger')
  }

  function editItem (id) {
    setIsEditing(true)
      const itemBeingEdited = groceryList.find(item => {
        if(item.id === id){
          return item
        }
      })
      setEditId(id)
    setText(itemBeingEdited.value)
  }

  function displayAlert (show=false, msg='', condition='') {
    setAlert({show, msg, condition})
  }

  useEffect(() => {
    const alerting = setTimeout(()=> {
      displayAlert()
    }, 2000)

    return () => clearTimeout(alerting)
  }, [groceryList])


  useEffect(()=>{
      localStorage.setItem('list' , JSON.stringify(groceryList))
  }, [groceryList])

  const listElements = groceryList.map((item, index) => {
    return <main key={index} className="flex justify-between items-center md:tracking-widest font-semibold">
              <p className="text-white text-3xl max-w-[85%]">{item.value}</p>
              <div className="space-x-5">
                <button onClick={()=> editItem(item.id)} className='text-[#f5f5f5] text-xl'>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button onClick={() => deleteItem(item.id)} className='text-red-500 text-xl'>
                  <i className="fa-sharp fa-solid fa-trash"></i>
                </button>
              </div>
          </main>
  })

  return (
    <div className="App container relative mx-auto w-full min-h-screen 
                    flex flex-col items-center space-y-8 md:w-[75%] p-4">
      <section className='text-center'>
          <h1 className="font-bold text-3xl md:text-5xl">
              Groceries
          </h1>
          <p className="text-xs md:text-sm font-thin">
            ...nothing worse than forgetting to get those carrots!
          </p>
      </section>

      
      {alert.show && <p className={`${alert.condition} capitalize w-full tracking-wider text-center rounded-sm text-sm font-semibold md:text-md`}>{alert.msg}</p>}


      <div className='w-full md:space-x-6 md:flex space-y-4 md:space-y-0'>
        <form action=""className='md:w-[30%] flex flex-col items-center ' onSubmit={handleSubmit}>
          <input 
              type="text" 
              id=""
              value={text}
              placeholder= "bread..."
              onChange={(event) => setText(event.target.value)} 
              className='md:block text-black px-2 inline tracking-widest w-full border-x-2 border-t h-10' 
          />

          <button 
              type="submit" 
              className='capitalize bg-sky-300 md:block h-10 px-3 py-1
              tracking-widest w-full rounded-sm'>enter
          </button>


        </form>

        <article className='md:w-[70%]  w-full md:space-y-4 pb-12 space-y-2'>
            {listElements}
        </article>
      </div>

      {groceryList.length > 0 && <button 
              onClick={()=> {
                      setGroceryList([])
                      displayAlert(true, 'item list cleared', 'danger')
                    }} 
              className='font-extrabold absolute bottom-0 right-0 left-0 w-[50%] md:w-[25%] mx-auto my-12 tracking-widest border-4 border-white px-2 h-12 hover:border-0 hover:bg-red-700 hover:text-white'>Empty List</button>}
      
      
    </div>
  )
}
``
export default App
