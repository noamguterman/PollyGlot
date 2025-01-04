import OpenAI from 'openai'

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
  }

export default {
	async fetch(request, env, ctx) {
		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}
		
		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY
		})
		
		try {
			const messages = await request.json()
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-4',
				messages,
				max_tokens: 64,
				temperature: 0.5
			})
			const response = chatCompletion.choices[0].message

			return new Response(JSON.stringify(response), { headers: corsHeaders })
		} catch(err) {
			return new Response(err, { headers: corsHeaders })
		}
	},
}
