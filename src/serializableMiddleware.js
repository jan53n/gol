import { Iterable } from 'immutable'
import {
    createSerializableStateInvariantMiddleware,
    isPlain,
} from '@reduxjs/toolkit'

// Augment middleware to consider Immutable.JS iterables serializable
const isSerializable = (value) => Iterable.isIterable(value) || isPlain(value)

const getEntries = (value) => Iterable.isIterable(value) ? value.entries() : Object.entries(value);

export const serializableMiddleware = createSerializableStateInvariantMiddleware({
    isSerializable,
    getEntries,
});