import { NextResponse } from "next/server";

import { getAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const results: any = {
      environment: {},
      database: {},
      storage: {},
    };

    // Check environment variables (don't expose actual values)
    results.environment = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) || "missing",
    };

    // Test Supabase client creation
    try {
      const supabase = getAdminClient();
      results.client = "initialized";

      // Test database connection
      const { data: productCount, error: dbError } = await supabase.from("products").select("id", { count: "exact" });

      if (dbError) {
        results.database = {
          status: "error",
          error: dbError.message,
          code: dbError.code,
        };
      } else {
        results.database = {
          status: "connected",
          tablesAccessible: true,
        };
      }

      // Test storage connection
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

      if (storageError) {
        results.storage = {
          status: "error",
          error: storageError.message,
        };
      } else {
        results.storage = {
          status: "connected",
          buckets: buckets?.map((b) => ({
            name: b.id,
            public: b.public,
          })),
          hasProductImages: buckets?.some((b) => b.id === "product-images"),
        };
      }

      // If product-images bucket exists, test upload permissions
      if (buckets?.some((b) => b.id === "product-images")) {
        const testFileName = `test-${Date.now()}.txt`;
        const testContent = "Test file for connection";

        const { error: uploadError } = await supabase.storage.from("product-images").upload(testFileName, testContent, {
          contentType: "text/plain",
        });

        if (uploadError) {
          results.storage.uploadTest = {
            status: "error",
            error: uploadError.message,
          };
        } else {
          // Clean up test file
          await supabase.storage.from("product-images").remove([testFileName]);

          results.storage.uploadTest = {
            status: "success",
            message: "Upload and delete permissions verified",
          };
        }
      }
    } catch (clientError: any) {
      results.client = {
        status: "error",
        error: clientError.message,
      };
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "fatal_error",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}
