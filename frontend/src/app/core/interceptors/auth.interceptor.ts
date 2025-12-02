import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/registro')) {
    return next(req);
  }

  if (username && password) {
    const credentials = btoa(`${username}:${password}`);
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${credentials}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
