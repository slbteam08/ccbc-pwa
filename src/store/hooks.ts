import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'

/**
 * Typed version of useDispatch hook for use throughout the app
 * Provides type safety when dispatching actions
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * Typed version of useSelector hook for use throughout the app
 * Provides type safety when selecting state from the store
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector