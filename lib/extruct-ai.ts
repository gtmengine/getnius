const EXTRUCT_API_BASE = 'https://api.extruct.ai/v1'

export interface ExtructCompany {
  id: string
  name: string
  website?: string
  description?: string
  location?: string
  industry?: string
  employees?: number
  founded?: number
  revenue?: string
  growth_rate?: string
  funding?: string
  competitors?: string[]
  [key: string]: any
}

export interface ExtructTable {
  id: string
  name: string
  description?: string
  columns: Array<{
    name: string
    type: string
    description?: string
  }>
  created_at: string
  updated_at: string
}

export interface ExtructSearchResponse {
  companies: ExtructCompany[]
  total: number
  table_id: string
}

export class ExtructAI {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.EXTRUCT_API_KEY || ''
    this.baseUrl = EXTRUCT_API_BASE
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'accept': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`Extruct AI API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getTables(): Promise<ExtructTable[]> {
    const data = await this.request('/tables')
    return data.tables || data
  }

  async createTable(name: string, columns: any[], description?: string): Promise<ExtructTable> {
    const data = await this.request('/tables', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: description || '',
        columns,
      }),
    })
    return data
  }

  async addCompanies(tableId: string, companies: any[], run: boolean = true): Promise<any> {
    const rows = companies.map(company => ({
      data: typeof company === 'string' ? { input: company } : company,
    }))

    const data = await this.request(`/tables/${tableId}/rows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rows,
        run,
      }),
    })
    return data
  }

  async getTableData(tableId: string): Promise<ExtructSearchResponse> {
    const data = await this.request(`/tables/${tableId}/data`)
    return {
      companies: data.rows || [],
      total: data.total || 0,
      table_id: tableId,
    }
  }

  async searchCompanies(query: string, limit: number = 50): Promise<ExtructCompany[]> {
    // First create a temporary table for this search
    const tableName = `search_${Date.now()}`
    const columns = [
      { name: 'Company Name', type: 'text', description: 'Company name' },
      { name: 'Website', type: 'url', description: 'Company website' },
      { name: 'Industry', type: 'text', description: 'Industry sector' },
      { name: 'Location', type: 'text', description: 'Company location' },
      { name: 'Employees', type: 'number', description: 'Number of employees' },
      { name: 'Founded', type: 'number', description: 'Year founded' },
      { name: 'Revenue', type: 'text', description: 'Annual revenue' },
      { name: 'Description', type: 'text', description: 'Company description' },
      { name: 'Funding', type: 'text', description: 'Funding information' },
    ]

    try {
      const table = await this.createTable(tableName, columns, `Search results for: ${query}`)

      // Add the search query as input
      await this.addCompanies(table.id, [{ input: query }])

      // Wait a moment for processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Get the results
      const results = await this.getTableData(table.id)
      return results.companies.slice(0, limit)

    } catch (error) {
      console.error('Extruct AI search error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const extructAI = new ExtructAI()
