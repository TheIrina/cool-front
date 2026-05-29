"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import { searchProducts } from "@modules/search/actions"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import Modal from "@modules/common/components/modal"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import debounce from "lodash/debounce"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { listCollections } from "@lib/data/collections"

export default function SearchModal() {
  const { state: isOpen, open, close } = useToggleState()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [collections, setCollections] = useState<HttpTypes.StoreCollection[]>([])
  const [isPending, startTransition] = useTransition()
  const params = useParams()
  const router = useRouter()
  const countryCode = params?.countryCode as string

  const saveSearchQuery = useCallback((q: string) => {
    if (!q.trim()) return
    try {
      const stored = localStorage.getItem("recent_searches")
      let searches: string[] = []
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          searches = parsed
        }
      }
      searches = [
        q.trim(),
        ...searches.filter((item) => item.toLowerCase() !== q.trim().toLowerCase())
      ]
      searches = searches.slice(0, 3)
      localStorage.setItem("recent_searches", JSON.stringify(searches))
      setRecentSearches(searches)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem("recent_searches")
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setRecentSearches(parsed.slice(0, 3))
          }
        }
      } catch (e) {
        console.error(e)
      }

      listCollections()
        .then((res) => {
          if (res?.collections) {
            setCollections(res.collections.slice(0, 6))
          }
        })
        .catch((e) => console.error(e))
    }
  }, [isOpen])

  const debouncedSearch = useCallback(
    debounce((q: string, cc: string) => {
      if (!q) {
        setResults([])
        return
      }
      startTransition(async () => {
        try {
          const products = await searchProducts(q, cc)
          setResults(products)
        } catch (e) {
          console.error(e)
        }
      })
    }, 300),
    []
  )

  useEffect(() => {
    debouncedSearch(query, countryCode)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query, countryCode, debouncedSearch])

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults([])
      setSelectedIndex(-1)
    }
  }, [isOpen])

  // Reset index when search results change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [results, query])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) =>
        results.length > 0 ? Math.min(prev + 1, results.length - 1) : -1
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        const selectedProduct = results[selectedIndex]
        saveSearchQuery(query)
        close()
        router.push(`/${countryCode}/products/${selectedProduct.handle}`)
      } else {
        if (query.trim()) {
          saveSearchQuery(query)
        }
        close()
        const searchParams = new URLSearchParams()
        searchParams.set("q", query)
        router.push(`/${countryCode}/store?${searchParams.toString()}`)
      }
    }
  }

  return (
    <>
      <button onClick={open} className="hover:text-gray-300">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <Modal isOpen={isOpen} close={close} size="large" search>
        <div className="flex flex-col w-full bg-black rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] min-h-[200px] mt-16">
          {/* Search Header */}
          <div className="flex items-center p-5 gap-4 bg-black">
            <div className="p-2 bg-white/5 rounded-full">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-xl text-white placeholder:text-white/40 font-light tracking-wide"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button onClick={close} className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 group">
              <span className="sr-only">Cerrar</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/40 group-hover:text-white/80 transition-colors">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-black">
            {isPending && (
              <div className="flex items-center justify-center gap-3 py-12">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                <span className="text-white/50 text-sm tracking-wide">Buscando...</span>
              </div>
            )}

            {!isPending && query && results.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/30">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-white/40 text-sm">No se encontraron productos para</p>
                <p className="text-white/70 font-medium mt-1">&ldquo;{query}&rdquo;</p>
              </div>
            )}

            {!isPending && !query && (
              <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-8">
                {/* Popular Collections Section */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">
                    Colecciones
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {collections.length > 0 ? (
                      collections.map((col) => (
                        <button
                          key={col.id}
                          onClick={() => {
                            setQuery(col.title)
                            debouncedSearch(col.title, countryCode)
                          }}
                          className="bg-white hover:bg-gray-100 text-black px-4 py-3 rounded-full text-sm font-semibold transition-colors duration-200 shadow-md min-h-[64px] flex items-center justify-center text-center cursor-pointer border border-transparent"
                        >
                          {col.title}
                        </button>
                      ))
                    ) : (
                      <div className="text-xs text-white/20 italic col-span-2 sm:col-span-3">Cargando colecciones...</div>
                    )}
                  </div>
                </div>

                {/* Recent Searches Section */}
                <div className="flex flex-col gap-3 border-t border-white/5 pt-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      Búsquedas Recientes
                    </h3>
                    {recentSearches.length > 0 && (
                      <button
                        onClick={() => {
                          try {
                            localStorage.removeItem("recent_searches")
                            setRecentSearches([])
                          } catch (e) {
                            console.error(e)
                          }
                        }}
                        className="text-[10px] text-white/30 hover:text-white/60 transition-colors font-semibold"
                      >
                        Limpiar Historial
                      </button>
                    )}
                  </div>

                  {recentSearches.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => {
                            setQuery(search)
                            debouncedSearch(search, countryCode)
                          }}
                          className="bg-white hover:bg-gray-100 text-black px-4 py-3 rounded-full text-sm font-semibold transition-colors duration-200 shadow-md min-h-[64px] flex items-center justify-center text-center cursor-pointer border border-transparent truncate"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/20 italic">No tienes búsquedas recientes</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {results.map((product, index) => {
                const { cheapestPrice } = getProductPrice({ product })
                const isSelected = selectedIndex === index

                return (
                  <LocalizedClientLink
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group border ${
                      isSelected
                        ? "bg-white/10 border-white/20"
                        : "border-transparent hover:bg-white/5 hover:border-white/10"
                    }`}
                    onClick={close}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="h-16 w-16 relative flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                      <Thumbnail thumbnail={product.thumbnail} size="full" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-base text-white/90 group-hover:text-white transition-colors">{product.title}</span>
                      {product.collection && (
                        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{product.collection.title}</span>
                      )}
                    </div>
                    
                    {/* Right side container with price & arrow */}
                    <div className="ml-auto flex items-center gap-4">
                      {cheapestPrice && (
                        <div className="text-right flex flex-col items-end">
                          {cheapestPrice.price_type === "sale" && (
                            <span className="text-xs line-through text-white/40 font-light">
                              {cheapestPrice.original_price}
                            </span>
                          )}
                          <span className={`text-sm font-semibold transition-colors ${
                            cheapestPrice.price_type === "sale" 
                              ? "text-amber-400 group-hover:text-amber-300" 
                              : "text-white/80 group-hover:text-white"
                          }`}>
                            {cheapestPrice.calculated_price}
                          </span>
                        </div>
                      )}
                      
                      <div className={`transition-opacity duration-200 ${
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/50">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </LocalizedClientLink>
                )
              })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
