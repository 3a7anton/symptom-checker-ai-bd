// AI service using OpenRouter for multiple model access

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration?: string;
  description?: string;
}

export interface AnalysisResult {
  summary: string;
  possibleConditions: string[];
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  disclaimer: string;
}

export class AIService {
  private static instance: AIService;

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async analyzeSymptoms(symptoms: Symptom[]): Promise<AnalysisResult> {
    if (symptoms.length === 0) {
      throw new Error('No symptoms provided for analysis');
    }

    // Check if demo mode is enabled or API key is missing
    const useDemoMode = import.meta.env.VITE_USE_DEMO_MODE === 'true';
    const hasApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!hasApiKey || useDemoMode) {
      console.log('Using offline analysis mode...');
      return this.generateOfflineAnalysis(symptoms);
    }

    try {
      const symptomText = symptoms
        .map(s => `${s.name} (${s.severity}${s.duration ? `, ${s.duration}` : ''})${s.description ? ` - ${s.description}` : ''}`)
        .join(', ');

      const prompt = `
You are a medical AI assistant providing preliminary symptom analysis for educational purposes.
Analyze these symptoms and provide structured insights:

Symptoms: ${symptomText}

Respond with a JSON object containing:
{
  "summary": "Brief analysis of symptom patterns",
  "possibleConditions": ["3-5 possible conditions"],
  "recommendations": ["3-5 practical recommendations"],
  "urgencyLevel": "low|medium|high|emergency",
  "disclaimer": "Medical disclaimer"
}

Guidelines:
- Be conservative and educational
- Always recommend professional medical consultation
- Focus on common conditions and general wellness
- Provide appropriate urgency assessment
- Include clear medical disclaimer
`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": import.meta.env.VITE_SITE_URL || "http://localhost:5174",
          "X-Title": import.meta.env.VITE_SITE_NAME || "AI Symptom Checker",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": import.meta.env.VITE_AI_MODEL || "anthropic/claude-sonnet-4",
          "messages": [
            {
              "role": "system",
              "content": "You are a helpful medical AI assistant that provides preliminary symptom analysis for educational purposes only. Always emphasize professional medical consultation."
            },
            {
              "role": "user",
              "content": prompt
            }
          ],
          "max_tokens": parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 1000,
          "temperature": 0.3
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from OpenRouter API');
      }

      // Try to parse JSON response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisResult: AnalysisResult = JSON.parse(jsonMatch[0]);
          
          // Validate the response structure
          if (!analysisResult.summary || !Array.isArray(analysisResult.possibleConditions)) {
            throw new Error('Invalid response structure');
          }
          
          return analysisResult;
        } else {
          // Fallback: parse plain text response
          return this.parsePlainTextResponse(content, symptoms);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, using fallback parsing:', parseError);
        return this.parsePlainTextResponse(content, symptoms);
      }

    } catch (error) {
      console.error('OpenRouter AI Error:', error);
      
      // Enhanced error handling
      if (error instanceof Error) {
        if (error.message.includes('402') || error.message.includes('Insufficient Balance')) {
          console.log('OpenRouter API has insufficient balance, using offline analysis...');
        } else if (error.message.includes('429') || error.message.includes('rate limit')) {
          console.log('OpenRouter API rate limit exceeded, using offline analysis...');
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          console.log('OpenRouter API key invalid, using offline analysis...');
        } else {
          console.log('OpenRouter API error occurred, using offline analysis...');
        }
      }
      
      // Always fallback to offline analysis
      return this.generateOfflineAnalysis(symptoms);
    }
  }

  private generateOfflineAnalysis(symptoms: Symptom[]): AnalysisResult {
    const symptomNames = symptoms.map(s => s.name.toLowerCase());
    const severityLevels = symptoms.map(s => s.severity);
    const hasSevere = severityLevels.includes('severe');
    const hasModerate = severityLevels.includes('moderate');
    
    // Determine urgency based on symptoms and severity
    let urgencyLevel: 'low' | 'medium' | 'high' | 'emergency' = 'low';
    if (hasSevere && symptoms.length > 2) {
      urgencyLevel = 'high';
    } else if (hasSevere || (hasModerate && symptoms.length > 3)) {
      urgencyLevel = 'medium';
    }

    // Generate contextual analysis based on common symptom patterns
    const respiratorySymptoms = ['cough', 'shortness of breath', 'chest pain', 'sore throat'];
    const hasRespiratory = respiratorySymptoms.some(s => symptomNames.some(symptom => symptom.includes(s.split(' ')[0])));
    
    const neurologicalSymptoms = ['headache', 'dizziness', 'fatigue'];
    const hasNeurological = neurologicalSymptoms.some(s => symptomNames.some(symptom => symptom.includes(s)));

    let summary = '';
    let possibleConditions: string[] = [];
    let recommendations: string[] = [];

    if (hasRespiratory && hasSevere) {
      summary = 'You are experiencing respiratory symptoms with severe intensity that may require medical attention.';
      possibleConditions = [
        'Upper respiratory tract infection',
        'Bronchitis or pneumonia', 
        'Allergic reaction',
        'Viral infection (COVID-19, flu)'
      ];
      recommendations = [
        'Consider seeking medical attention promptly',
        'Monitor breathing and seek emergency care if breathing becomes difficult',
        'Rest and stay hydrated',
        'Avoid strenuous activities'
      ];
    } else if (hasNeurological && symptoms.length >= 2) {
      summary = 'Your neurological symptoms may be related to stress, dehydration, or other common conditions.';
      possibleConditions = [
        'Tension headache or migraine',
        'Dehydration or electrolyte imbalance',
        'Sleep deprivation effects',
        'Stress-related symptoms'
      ];
      recommendations = [
        'Ensure adequate hydration and rest',
        'Practice stress management techniques',
        'Consider over-the-counter pain relief if appropriate',
        'Monitor symptoms and consult healthcare provider if persistent'
      ];
    } else {
      summary = `You have ${symptoms.length} symptom${symptoms.length > 1 ? 's' : ''} that may indicate a common condition requiring monitoring.`;
      possibleConditions = [
        'Common viral infection',
        'Stress-related symptoms',
        'Minor health imbalance',
        'Lifestyle-related condition'
      ];
      recommendations = [
        'Monitor symptoms over the next 24-48 hours',
        'Get adequate rest and stay hydrated',
        'Consider consulting healthcare provider if symptoms worsen',
        'Practice good hygiene and self-care'
      ];
    }

    return {
      summary,
      possibleConditions,
      recommendations,
      urgencyLevel,
      disclaimer: 'This analysis is generated by an AI system for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for proper medical evaluation.'
    };
  }

  private parsePlainTextResponse(content: string, symptoms: Symptom[]): AnalysisResult {
    // Determine urgency based on severe symptoms
    const severeCount = symptoms.filter(s => s.severity === 'severe').length;
    const moderateCount = symptoms.filter(s => s.severity === 'moderate').length;
    
    let urgencyLevel: 'low' | 'medium' | 'high' | 'emergency' = 'low';
    if (severeCount > 0) {
      urgencyLevel = severeCount > 1 ? 'emergency' : 'high';
    } else if (moderateCount > 2) {
      urgencyLevel = 'medium';
    }

    return {
      summary: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
      possibleConditions: [
        'Various conditions could cause these symptoms',
        'Consultation with healthcare provider recommended',
        'Professional diagnosis required'
      ],
      recommendations: [
        'Schedule appointment with healthcare provider',
        'Monitor symptoms and note any changes',
        'Maintain adequate rest and hydration',
        'Seek immediate care if symptoms worsen'
      ],
      urgencyLevel,
      disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment.'
    };
  }

  async generateHealthTips(analysisResult: AnalysisResult): Promise<string[]> {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": import.meta.env.VITE_SITE_URL || "http://localhost:5174",
          "X-Title": import.meta.env.VITE_SITE_NAME || "AI Symptom Checker",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": import.meta.env.VITE_AI_MODEL || "anthropic/claude-sonnet-4",
          "messages": [
            {
              "role": "system",
              "content": "Generate 5 general health and wellness tips based on the symptom analysis. Focus on preventive care and general wellness."
            },
            {
              "role": "user",
              "content": `Based on this symptom analysis: "${analysisResult.summary}", provide 5 practical health tips.`
            }
          ],
          "max_tokens": 300,
          "temperature": 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Extract tips from the response
      const tips = content
        .split('\n')
        .filter((line: string) => line.trim().length > 0 && (line.includes('.') || line.includes('-')))
        .slice(0, 5)
        .map((tip: string) => tip.replace(/^\d+\.?\s*|-\s*/, '').trim());

      return tips.length > 0 ? tips : this.getDefaultHealthTips();

    } catch (error) {
      console.error('Error generating health tips with OpenRouter:', error);
      return this.getDefaultHealthTips();
    }
  }

  private getDefaultHealthTips(): string[] {
    return [
      'Maintain a balanced diet rich in fruits and vegetables',
      'Get adequate sleep (7-9 hours per night)', 
      'Stay hydrated by drinking plenty of water throughout the day',
      'Exercise regularly but listen to your body\'s signals',
      'Practice stress management techniques like meditation or deep breathing'
    ];
  }
}

export default AIService;
