import { FormEvent, useEffect, useState } from 'react';
import { LockKeyhole, Mail } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearAuthError, loginRequested, TEST_CREDENTIALS } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
    }
  }, [isAuthenticated, onOpenChange, open]);

  useEffect(() => {
    if (open) {
      dispatch(clearAuthError());
    }
  }, [dispatch, open]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginRequested({ email, password }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вход в аккаунт</DialogTitle>
          <DialogDescription>Используйте тестовый аккаунт для входа в демо.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Пароль</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </label>

          {error ? <p className="rounded-md border border-red-500/50 bg-red-500/10 p-2 text-sm text-red-300">{error}</p> : null}

          <div className="rounded-md border border-border bg-[#181818] p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Тестовый вход</p>
            <p>Email: {TEST_CREDENTIALS.email}</p>
            <p>Пароль: {TEST_CREDENTIALS.password}</p>
          </div>

          <Button className="w-full bg-[#ff5500] text-white hover:bg-[#ff6a1f]" type="submit">
            Войти
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
