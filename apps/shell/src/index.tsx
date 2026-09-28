// This asynchronous boundary lets Module Federation initialize shared modules
// before bootstrap.tsx consumes the shared React singleton.
import('./bootstrap');
