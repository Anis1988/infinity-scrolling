import React, {useState,useEffect}from "react";
import axios from 'axios';

export default function useBookSearch(query,pageNumber) {
const[loading,setLoading] = useState(true)
const[error,setError] = useState(false)
const[books,setBooks] = useState([])
const[hasMore,setHasMore] = useState(false)


    useEffect(()=>{
        setLoading(true)
        setError(false)

        let cancel
        axios({
            methode:"GET",
            url:"http://openlibrary.org/search.json",
            params:{q:query, page:pageNumber}, // that how they called id "params","q","page"
            cancelToken: new axios.CancelToken(c=> cancel = c)
        }).then(res=> {
            console.log(res.data)
            setBooks(prevBooks => {
                return [...new Set([...prevBooks,...res.data.docs.map(t=>t.title)])] //unique set
                console.log(res.data)
            })
            setHasMore(res.data.length > 0)
            setLoading(false)
            setError(false)
        }).catch(e=> {
            if(axios.isCancel(e)) return //this is meant to ignore all the cancellation we meant to cancel
            setError(true)
        })
        return () => cancel()
    },[query,pageNumber])

    useEffect(()=>{
        setBooks([])
    },[query])

    return{loading,error,hasMore,books}

}