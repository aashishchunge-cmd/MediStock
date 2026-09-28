const { createClient } = supabase;


/* YOUR SUPABASE PROJECT */

const SUPABASE_URL =
    "https://aqnenatzocfbhpkyajhs.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_4vtNQsQCRCbko1ZhPC_sxw_tR61QSMM";


const supabaseClient =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );