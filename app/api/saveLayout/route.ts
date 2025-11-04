import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();
    const { layoutData, layoutName = 'default' } = body;

    if (!layoutData) {
      return NextResponse.json(
        { error: 'Layout data is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with cookie-based auth
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: {
          getItem: async (key: string) => {
            return cookieStore.get(key)?.value || null;
          },
          setItem: async (key: string, value: string) => {
            // This is handled by Supabase client in browser
          },
          removeItem: async (key: string) => {
            // This is handled by Supabase client in browser
          },
        },
      },
    });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Upsert layout (insert or update if exists)
    const { data, error } = await supabase
      .from('frame_layouts')
      .upsert(
        {
          user_id: user.id,
          layout_name: layoutName,
          layout_data: layoutData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,layout_name',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      layout: data,
    });
  } catch (error: any) {
    console.error('Save layout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save layout' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const layoutName = searchParams.get('layoutName') || 'default';

    const cookieStore = await cookies();

    // Create Supabase client with cookie-based auth
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: {
          getItem: async (key: string) => {
            return cookieStore.get(key)?.value || null;
          },
          setItem: async (key: string, value: string) => {
            // This is handled by Supabase client in browser
          },
          removeItem: async (key: string) => {
            // This is handled by Supabase client in browser
          },
        },
      },
    });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get layout
    const { data, error } = await supabase
      .from('frame_layouts')
      .select('*')
      .eq('user_id', user.id)
      .eq('layout_name', layoutName)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No layout found
        return NextResponse.json({
          success: true,
          layout: null,
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      layout: data,
    });
  } catch (error: any) {
    console.error('Get layout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get layout' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const layoutName = searchParams.get('layoutName') || 'default';

    const cookieStore = await cookies();

    // Create Supabase client with cookie-based auth
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: {
          getItem: async (key: string) => {
            return cookieStore.get(key)?.value || null;
          },
          setItem: async (key: string, value: string) => {
            // This is handled by Supabase client in browser
          },
          removeItem: async (key: string) => {
            // This is handled by Supabase client in browser
          },
        },
      },
    });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete layout
    const { error } = await supabase
      .from('frame_layouts')
      .delete()
      .eq('user_id', user.id)
      .eq('layout_name', layoutName);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Delete layout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete layout' },
      { status: 500 }
    );
  }
}
