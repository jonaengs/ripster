import { useState, useEffect } from 'react';
import { PrintableSong } from './Print';
import { useLocalStorage } from '@uidotdev/usehooks';

const SPOTIFY_CLIENT_ID = '309330d9a9df4450bb1bc8f9b7d45157';
const REDIRECT_URI = 'https://ripster.pages.dev/spotify';
const SCOPES = ['playlist-read-private', 'playlist-read-collaborative'];

interface PlayList {
  id: string;
  name: string;
}

interface SpotifyTrack {
  name: string;
  href: string;
  artists: { name: string }[];
  album: {
    release_date: string
  }
}

/**
 * NOTE: This component has some limits currently due to laziness:
 * 1. It only fetches the user's first 50 playlists (by whatever ordering Spotify uses)
 * 2. It only fetches the first 250 tracks from the chosen playlist (again, by whatever ordering Spotify uses)
 */
const SpotifyInner = ({setSongs}: {setSongs: (songs: PrintableSong[]) => void}) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState<PlayList[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function trackToPrintableSong(track: SpotifyTrack): PrintableSong {
    return {
      url: track.href,
      title: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      year: track.album.release_date.substring(0, 4),
    }
  }

  console.log({ token, loading, playlists, error });

  useEffect(() => {
    // Check if we're returning from Spotify auth
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        setToken(accessToken);
        window.location.hash = '';
      }
    }
  }, []);

  const login = () => {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(' '),
    };
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log(data)
      setPlaylists(data.items);
    } catch (error) {
      setError('Error fetching playlists: ' + error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchTracks = async (playlistId: string) => {
    setLoading(true);
    const fieldsParam = "items(track(name,href,artists(name),album(release_date)))"
    let fetchedTracks: SpotifyTrack[] = []
    console.log('fetching tracks', playlistId)
    for (let i = 0; i < 5; i++) {
      try {
        const urlParams = new URLSearchParams({ fields: fieldsParam, limit: '50', offset: fetchedTracks.length.toString() });
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?${urlParams}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log(data)

        if (data.items.length === 0) {
          break;
        }
        fetchedTracks = fetchedTracks.concat(data.items);
      } catch (error) {
        setError('Error fetching tracks: ' + error);
        return;
      } finally {
        setLoading(false);
      }
      setSongs(
        fetchedTracks.map(trackToPrintableSong)
      )
    }
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-4 text-red-500">{error}</div>;
  }

  if (playlists !== null) {
    return playlists.map((playlist) => (
      <div className='flex flex-row'>
        <div>{playlist.name}</div>
        <div>
          <button
            onClick={() => fetchTracks(playlist.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Fetching tracks...' : 'Fetch Tracks'}
          </button>
        </div>
      </div>
    ))
  }

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <button
          onClick={login}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Connect to Spotify
        </button>
      </div>
    );
  }

  if (playlists === null) {
    return <div className="space-y-4">
      <button
        onClick={fetchPlaylists}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Fetching playlists...' : 'Fetch Playlists'}
      </button>
    </div>
  }
}

export const Spotify = () => {
  // TODO: This is invalid as this actually reads entries, which are required to have an ID
  // However, we're removing the ids very soon, so I'll leave it like this for now
  const [, setSongs] = useLocalStorage<PrintableSong[]>('entries', [])

  function onSetSongs(songs: PrintableSong[]) {
    setSongs(songs)
    window.location.replace('/print')
  }

  return <SpotifyInner setSongs={onSetSongs} />
};
