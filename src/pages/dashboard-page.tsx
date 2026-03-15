import { type ChangeEvent, useMemo, useRef, useState } from 'react';
import { UploadCloud, LogOut, Flame } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { addAudio } from '@/features/audio/audioSlice';
import type { AudioItem } from '@/types/audio';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function getAudioDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const audio = document.createElement('audio');
    const objectUrl = URL.createObjectURL(file);

    audio.preload = 'metadata';
    audio.src = objectUrl;

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Не удалось прочитать аудиофайл'));
    };
  });
}

function formatDuration(seconds: number) {
  const total = Math.floor(seconds);
  const min = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const sec = (total % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function isAudioFile(file: File) {
  if (file.type.startsWith('audio/')) {
    return true;
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const knownAudioExtensions = new Set(['wav', 'mp3', 'm4a', 'aac', 'ogg', 'flac', 'webm']);
  return knownAudioExtensions.has(ext);
}

function inferAudioType(file: File) {
  if (file.type) {
    return file.type;
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const byExt: Record<string, string> = {
    wav: 'audio/wav',
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    webm: 'audio/webm'
  };

  return byExt[ext] ?? 'audio/unknown';
}

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const { items } = useAppSelector((state) => state.audio);
  const userEmail = useAppSelector((state) => state.auth.userEmail);

  const rows = useMemo(() => {
    return items.map((item) => ({
      ...item,
      uploadedAtFormatted: new Date(item.uploadedAt).toLocaleString('ru-RU')
    }));
  }, [items]);

  const handleSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      return;
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (const file of Array.from(fileList)) {
      const durationResult = await getAudioDuration(file).catch(() => null);
      const likelyAudio = isAudioFile(file);

      if (!likelyAudio && durationResult === null) {
        skippedCount += 1;
        continue;
      }

      const item: AudioItem = {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type: inferAudioType(file),
        sizeKb: Number((file.size / 1024).toFixed(2)),
        durationSec: durationResult ?? 0,
        uploadedAt: new Date().toISOString()
      };

      dispatch(addAudio(item));
      addedCount += 1;
    }

    if (addedCount > 0 && skippedCount === 0) {
      setUploadMessage(`Успешно добавлено: ${addedCount}`);
    } else if (addedCount > 0 && skippedCount > 0) {
      setUploadMessage(`Добавлено: ${addedCount}. Пропущено: ${skippedCount} (не удалось распознать как аудио).`);
    } else {
      setUploadMessage('Файл не распознан. На iPhone убедись, что файл загружен из iCloud локально (без статуса "Ошибка").');
    }

    event.target.value = '';
  };

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-8 text-foreground md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-[#111111] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[#ff5500]">
              <Flame className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.2em]">Library</span>
            </div>
            <h1 className="text-2xl font-semibold">Аудио-файлы</h1>
            <p className="text-sm text-muted-foreground">Пользователь: {userEmail}</p>
          </div>
          <Button className="gap-2" variant="outline" onClick={() => dispatch(logout())}>
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </header>

        <section className="rounded-2xl border border-border bg-[#111111] p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold">Загрузка аудио</h2>
            <input ref={inputRef} className="hidden" type="file" multiple onChange={handleSelect} />
            <Button className="gap-2 bg-[#ff5500] text-white hover:bg-[#ff6a1f]" onClick={() => inputRef.current?.click()}>
              <UploadCloud className="h-4 w-4" />
              Добавить файл
            </Button>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            На iPhone файлы из iCloud могут не открываться, пока не скачаны локально в приложении «Файлы».
          </p>
          {uploadMessage ? <p className="mb-4 text-sm text-[#ffb07a]">{uploadMessage}</p> : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Размер (KB)</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Добавлен</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell className="text-muted-foreground" colSpan={5}>
                    Пока нет аудиофайлов. Нажмите «Добавить файл».
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.sizeKb}</TableCell>
                    <TableCell>{formatDuration(item.durationSec)}</TableCell>
                    <TableCell>{item.uploadedAtFormatted}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
      </div>
    </main>
  );
}
