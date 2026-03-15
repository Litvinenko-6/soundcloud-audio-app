import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, PlayCircle } from 'lucide-react';

import { useAppSelector } from '@/app/hooks';
import { AuthModal } from '@/components/auth-modal';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-foreground">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#ff5500]">
            <Flame className="h-6 w-6" />
            <span className="text-lg font-semibold">Soundboard Cloud</span>
          </div>
          <Button className="bg-[#ff5500] text-white hover:bg-[#ff6a1f]" onClick={() => setModalOpen(true)}>
            Авторизация
          </Button>
        </header>

        <section className="mt-16 grid flex-1 gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#ff9d66]">Inspired by SoundCloud</p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">Загружай треки и управляй своей аудио-библиотекой</h1>
            <p className="max-w-xl text-base text-zinc-300 md:text-lg">
              Минималистичное приложение с авторизацией, загрузкой файлов и быстрым просмотром метаданных каждого трека.
            </p>
            <Button
              className="h-12 gap-2 bg-white text-black hover:bg-zinc-200"
              size="lg"
              onClick={() => setModalOpen(true)}
            >
              <PlayCircle className="h-5 w-5" />
              Начать
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/50 p-6 shadow-2xl">
            <p className="mb-4 text-sm text-zinc-400">После входа вы получите:</p>
            <ul className="space-y-3 text-sm text-zinc-200">
              <li>Добавление аудиофайлов через удобный интерфейс</li>
              <li>Автоматическое определение длительности, размера и типа</li>
              <li>Табличный просмотр всей загруженной коллекции</li>
            </ul>
          </div>
        </section>
      </div>

      <AuthModal open={isModalOpen} onOpenChange={setModalOpen} />
    </main>
  );
}
