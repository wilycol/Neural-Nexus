
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkLatestPosts() {
  console.log('Checking latest posts from Beatriz V5...')
  const { data, error } = await supabase
    .from('news')
    .select('id, title, created_at, content_type, video_url, audio_url, subtitles_url, image_url, cover_url')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching posts:', error)
    return
  }

  console.table(data)
}

checkLatestPosts()
