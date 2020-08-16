import React, {useCallback, useRef, useState} from 'react';
import useBookSearch from "./useBookSearch";


function App() {
    const [query,setQuery] = useState('')
    const [pageNumber,setPageNumber] = useState(1)
    const {books,hasMore,loading,error}=useBookSearch(query,pageNumber)

    const observer = useRef()
    const lastBookElement = useCallback(node => {
        if(loading) return
        if(observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber +1 )
            }
        })
        if(node) observer.current.observe(node)
        console.log(node)
    },[loading,hasMore])

    function handelSearch(e) {
        setQuery(e.target.value)
        setPageNumber(1)
    }

    return (
      <>
          <input type="text" value={query} onChange={handelSearch}/>
          {books.map((book,index) => {
              if(books.length === index +1) {
              return <div ref={lastBookElement} key={book}>{book}</div>
          } else {
                  return <div key={book}>{book}</div>
          }

          })}
            <div>{loading && 'Loading...'}</div>
            <div>{error && 'Error'}</div>
      </>
  )
}
export default App;
