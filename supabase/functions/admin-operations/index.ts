import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DeleteAllEventsRequest {
  action: "delete_all";
  adminPassword: string;
}

interface DeleteEventRequest {
  action: "delete_event";
  adminPassword: string;
  eventId: string;
}

interface UploadEventsRequest {
  action: "upload_events";
  adminPassword: string;
  events: Array<{
    name: string;
    start_date: string;
    start_time?: string | null;
    end_date?: string | null;
    end_time?: string | null;
    address?: string | null;
    website?: string | null;
    description?: string | null;
    participation?: string | null;
    paid?: string | null;
    city_calendar?: string | null;
    zipcode?: string | null;
    org_name?: string | null;
    org_id?: string | null;
    org_type?: string | null;
    event_type?: string | null;
    event_city?: string | null;
    state?: string | null;
    source?: string | null;
    notes?: string | null;
    internal_type?: string | null;
    part_of_town?: string | null;
    event_category?: string | null;
    time_of_day?: string | null;
    status?: string;
  }>;
  cities: string[];
  source: string;
}

type AdminRequest = DeleteAllEventsRequest | DeleteEventRequest | UploadEventsRequest;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST" && req.method !== "DELETE") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body: AdminRequest = await req.json();
    const { adminPassword } = body;

    const correctPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!correctPassword || adminPassword !== correctPassword) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    if (body.action === "delete_all") {
      const { error, count } = await supabase
        .from("events")
        .delete({ count: "exact" })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true, count: count || 0 }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (body.action === "delete_event") {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", body.eventId);

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (body.action === "upload_events") {
      const eventsToInsert = body.events.map(event => ({
        ...event,
        status: "approved"
      }));

      const { error, data } = await supabase
        .from("events")
        .insert(eventsToInsert)
        .select();

      if (error) {
        throw error;
      }

      await supabase.from("upload_history").insert({
        event_count: eventsToInsert.length,
        cities: body.cities,
        source: body.source,
        notes: `${eventsToInsert.length} events across ${body.cities.length} ${body.cities.length === 1 ? 'city' : 'cities'}`,
      });

      return new Response(
        JSON.stringify({
          success: true,
          count: data?.length || 0,
          message: `Successfully published ${data?.length || 0} events`
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in admin-operations:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
