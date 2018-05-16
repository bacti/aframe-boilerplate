export class TweenDefine
{
	constructor()
	{
		this.NONE					= 0;
		this.LINEAR_EASE			= this.NONE + 1;
		this.ELASTIC_EASE_IN		= this.LINEAR_EASE + 1;
		this.ELASTIC_EASE_OUT		= this.ELASTIC_EASE_IN + 1;
		this.ELASTIC_EASE_INOUT		= this.ELASTIC_EASE_OUT + 1;
		this.BACK_EASE_IN			= this.ELASTIC_EASE_INOUT + 1;
		this.BACK_EASE_OUT			= this.BACK_EASE_IN + 1;
		this.BACK_EASE_INOUT		= this.BACK_EASE_OUT + 1;
		this.BOUNCE_EASE_IN			= this.BACK_EASE_INOUT + 1;
		this.BOUNCE_EASE_OUT		= this.BOUNCE_EASE_IN + 1;
		this.BOUNCE_EASE_INOUT		= this.BOUNCE_EASE_OUT + 1;
		this.QUAD_EASE_OUT			= this.BOUNCE_EASE_INOUT + 1;
		this.SINUSODIAL_EASE_IN		= this.QUAD_EASE_OUT + 1;
		this.SINUSODIAL_EASE_OUT	= this.SINUSODIAL_EASE_IN + 1;
		this.SINUSODIAL_EASE_INOUT	= this.SINUSODIAL_EASE_OUT + 1;
		this.EXPONENTIAL_IN			= this.SINUSODIAL_EASE_INOUT + 1;
		this.EXPONENTIAL_OUT		= this.EXPONENTIAL_IN + 1;
		this.EXPONENTIAL_INOUT		= this.EXPONENTIAL_OUT + 1;
	}
}